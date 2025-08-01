import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { recipeService, Recipe } from '../../services/recipeService';
import { notificationService } from '../../services/notificationService';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

const DifficultySelector = ({ selected, onSelect }: { selected: string, onSelect: (value: string) => void }) => {
    const difficulties = ["Fácil", "Médio", "Difícil"];
    return (
        <View style={styles.difficultyContainer}>
            {difficulties.map(d => (
                <TouchableOpacity
                    key={d}
                    style={[styles.difficultyButton, selected === d && styles.difficultyButtonSelected]}
                    onPress={() => onSelect(d)}
                >
                    <Text style={[styles.difficultyButtonText, selected === d && styles.difficultyButtonTextSelected]}>{d}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default function CreateEditRecipeScreen() {
    const { user } = useAuth()!;
    const router = useRouter();
    const params = useLocalSearchParams();
    const recipeId = params.id as string | undefined;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [difficulty, setDifficulty] = useState<'Fácil' | 'Médio' | 'Difícil'>('Fácil');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(!!recipeId); // Mostra loading se estiver editando

    useEffect(() => {
        const loadRecipeForEdit = async () => {
            if (recipeId) {
                try {
                    const existingRecipe = await recipeService.getRecipeById(recipeId);
                    if (existingRecipe) {
                        setTitle(existingRecipe.title);
                        setDescription(existingRecipe.description);
                        setIngredients(existingRecipe.ingredients.join('\n'));
                        setInstructions(existingRecipe.instructions.join('\n'));
                        setImageUri(existingRecipe.image_url || null);
                        setOriginalImageUrl(existingRecipe.image_url || null);
                        setPrepTime(String(existingRecipe.prep_time));
                        setCookTime(String(existingRecipe.cook_time));
                        setServings(String(existingRecipe.servings));
                        setDifficulty(existingRecipe.difficulty);
                        setCategory(existingRecipe.category);
                    }
                } catch (error) {
                    Alert.alert("Erro", "Não foi possível carregar os dados da receita.");
                } finally {
                    setPageLoading(false);
                }
            }
        };
        loadRecipeForEdit();
    }, [recipeId]);
    
    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        if (!user) return null;
        const response = await fetch(uri);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        
        const fileExt = uri.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error } = await supabase.storage
            .from('recipes-images')
            .upload(filePath, arrayBuffer, {
                contentType: `image/${fileExt}`,
                upsert: false,
            });

        if (error) {
            throw new Error('Erro ao fazer upload da imagem: ' + error.message);
        }
    
        const { data: { publicUrl } } = supabase.storage
            .from('recipes-images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !ingredients.trim() || !instructions.trim() || !category.trim() || !prepTime.trim() || !cookTime.trim() || !servings.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        if (!user) {
            Alert.alert('Erro', 'Você precisa estar logado para criar uma receita.');
            return;
        }

        setLoading(true);

        try {
            let imageUrl = originalImageUrl;
            if (imageUri && imageUri !== originalImageUrl) {
                const uploadedUrl = await uploadImage(imageUri);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }
            
            const recipeData = {
                title: title.trim(),
                description: description.trim(),
                ingredients: ingredients.trim().split('\n'),
                instructions: instructions.trim().split('\n'),
                image_url: imageUrl || undefined,
                user_id: user.id,
                prep_time: parseInt(prepTime, 10),
                cook_time: parseInt(cookTime, 10),
                servings: parseInt(servings, 10),
                difficulty,
                category: category.trim(),
            };

            if (recipeId) {
                await recipeService.updateRecipe(recipeId, recipeData);
                await notificationService.notifyRecipeUpdated(recipeData.title);
                Alert.alert('Sucesso', 'Receita atualizada com sucesso!');
            } else {
                await recipeService.createRecipe(recipeData);
                await notificationService.notifyRecipeCreated(recipeData.title);
                Alert.alert('Sucesso', 'Receita criada com sucesso!');
            }

            router.back();
        } catch (error: any) {
            Alert.alert('Erro ao Salvar', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <LinearGradient colors={['#ddd6fe', '#c4b5fd']} style={styles.container}>
                <ActivityIndicator size="large" color="#8b5cf6" />
            </LinearGradient>
        );
    }
    
    if (!user) {
        router.replace('/login');
        return null;
    }

    return (
        <LinearGradient colors={['#ddd6fe', '#c4b5fd']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{recipeId ? 'Editar Receita' : 'Nova Receita'}</Text>
                <View style={styles.form}>
                    <Text style={styles.label}>Título da Receita *</Text>
                    <TextInput style={styles.input} placeholder="Ex: Bolo de Chocolate" value={title} onChangeText={setTitle} placeholderTextColor="#666"/>
                    <Text style={styles.label}>Descrição Curta *</Text>
                    <TextInput style={styles.input} placeholder="Um bolo fofinho e delicioso..." value={description} onChangeText={setDescription} placeholderTextColor="#666"/>
                    <Text style={styles.label}>Ingredientes *</Text>
                    <TextInput style={[styles.input, styles.textArea]} placeholder="Liste os ingredientes, um por linha..." value={ingredients} onChangeText={setIngredients} multiline numberOfLines={6} placeholderTextColor="#666"/>
                    <Text style={styles.label}>Modo de Preparo *</Text>
                    <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva o passo a passo, um por linha..." value={instructions} onChangeText={setInstructions} multiline numberOfLines={8} placeholderTextColor="#666"/>
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Preparo (min) *</Text>
                            <TextInput style={styles.input} placeholder="15" value={prepTime} onChangeText={setPrepTime} keyboardType="numeric" placeholderTextColor="#666"/>
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Cozimento (min) *</Text>
                            <TextInput style={styles.input} placeholder="40" value={cookTime} onChangeText={setCookTime} keyboardType="numeric" placeholderTextColor="#666"/>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Porções *</Text>
                            <TextInput style={styles.input} placeholder="8" value={servings} onChangeText={setServings} keyboardType="numeric" placeholderTextColor="#666"/>
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Categoria *</Text>
                            <TextInput style={styles.input} placeholder="Sobremesa" value={category} onChangeText={setCategory} placeholderTextColor="#666"/>
                        </View>
                    </View>
                    <Text style={styles.label}>Dificuldade *</Text>
                    <DifficultySelector selected={difficulty} onSelect={(d) => setDifficulty(d as any)} />
                    <Text style={styles.label}>Imagem da Receita</Text>
                    <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="camera-outline" size={40} color="#64748b" />
                                <Text style={styles.imagePlaceholderText}>Toque para adicionar uma imagem</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Salvar Receita</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
    },
    form: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    difficultyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    difficultyButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    difficultyButtonSelected: {
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6',
    },
    difficultyButtonText: {
        fontWeight: '600',
        color: '#666',
    },
    difficultyButtonTextSelected: {
        color: '#fff',
    },
    imageButton: {
        marginTop: 8,
        marginBottom: 16,
    },
    imagePlaceholder: {
        height: 200,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#cbd5e1',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        marginTop: 8,
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
    },
    imagePreview: {
        height: 200,
        borderRadius: 12,
        resizeMode: 'cover',
    },
    saveButton: {
        backgroundColor: '#8b5cf6',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
});