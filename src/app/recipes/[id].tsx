import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { recipeService, Recipe } from "../../services/recipeService";
import { useAuth } from "../../context/AuthContext"; // Importar o useAuth

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth()!; // Obter o usuário logado

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setError("ID da receita inválido.");
      setLoading(false);
      return;
    }

    const loadRecipeDetails = async () => {
      setLoading(true);
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError("Erro ao carregar detalhes da receita.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRecipeDetails();
  }, [id]);
  
  const handleDelete = () => {
    Alert.alert(
      "Apagar Receita",
      "Tem certeza que deseja apagar esta receita? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              if (recipe?.id) {
                await recipeService.deleteRecipe(recipe.id);
                Alert.alert("Sucesso", "Receita apagada com sucesso!");
                router.back();
              }
            } catch (error: any) {
              Alert.alert("Erro", "Não foi possível apagar a receita: " + error.message);
            }
          },
        },
      ]
    );
  };

  const isOwner = user && recipe && user.id === recipe.user_id;

  if (loading) {
    return (
      <LinearGradient
        colors={["#ff9a9e", "#fad0c4"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Carregando receita...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#ff9a9e", "#fad0c4"]} style={styles.container}>
        <View style={styles.errorCard}>
          <MaterialIcons name="error" size={48} color="#f4511e" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!recipe) {
    return (
      <LinearGradient colors={["#ff9a9e", "#fad0c4"]} style={styles.container}>
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>Receita não encontrada</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#ff9a9e", "#fad0c4"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {recipe.image_url && (
            <Image source={{ uri: recipe.image_url }} style={styles.image} />
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.cuisine}>{recipe.category}</Text>

          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <MaterialIcons name="timer" size={20} color="#f4511e" />
              <Text style={styles.metadataText}>
                {recipe.prep_time + recipe.cook_time} min
              </Text>
            </View>

            <View style={styles.metadataItem}>
              <MaterialIcons name="restaurant" size={20} color="#f4511e" />
              <Text style={styles.metadataText}>{recipe.servings} porções</Text>
            </View>

            <View style={styles.metadataItem}>
              <MaterialIcons
                name="signal-cellular-alt"
                size={20}
                color="#f4511e"
              />
              <Text style={styles.metadataText}>{recipe.difficulty}</Text>
            </View>
          </View>
        </View>

        {isOwner && (
          <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/recipes/create-edit?id=${recipe.id}`)}>
                <MaterialIcons name="edit" size={20} color="#fff" />
                <Text style={styles.ownerButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <MaterialIcons name="delete" size={20} color="#fff" />
                <Text style={styles.ownerButtonText}>Apagar</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="list-alt" size={24} color="#f4511e" />
            <Text style={styles.sectionTitle}>Ingredientes</Text>
          </View>

          <View style={styles.ingredientsContainer}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <MaterialIcons
                  name="circle"
                  size={8}
                  color="#f4511e"
                  style={styles.bullet}
                />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="menu-book" size={24} color="#f4511e" />
            <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          </View>

          <View style={styles.instructionsContainer}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tipsContainer}>
          <MaterialIcons
            name="lightbulb-outline"
            size={24}
            color="#f4511e"
            style={styles.tipIcon}
          />
          <Text style={styles.tipText}>
            Dica: Esta receita combina perfeitamente com uma salada fresca e um
            bom vinho!
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#333",
        marginTop: 20,
    },
    errorCard: {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: 20,
        padding: 30,
        margin: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    errorText: {
        fontSize: 18,
        color: "#333",
        marginTop: 15,
        textAlign: "center",
    },
    image: {
        width: "100%",
        height: 300,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContainer: {
        padding: 20,
        paddingBottom: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 5,
    },
    cuisine: {
        fontSize: 18,
        color: "#f4511e",
        fontWeight: "600",
        marginBottom: 15,
    },
    metadataContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    metadataItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    metadataText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginLeft: 5,
    },
    ownerActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 15,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 3,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e74c3c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 3,
    },
    ownerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    section: {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: 20,
        padding: 20,
        margin: 15,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: "#fad0c4",
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#f4511e",
        marginLeft: 10,
    },
    ingredientsContainer: {
        paddingHorizontal: 10,
    },
    ingredientItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    bullet: {
        marginTop: 8,
        marginRight: 10,
    },
    ingredientText: {
        fontSize: 16,
        color: "#444",
        flex: 1,
        lineHeight: 24,
    },
    instructionsContainer: {
        paddingHorizontal: 5,
    },
    stepContainer: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "flex-start",
    },
    stepNumber: {
        backgroundColor: "#f4511e",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
        marginTop: 5,
    },
    stepText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    instructionText: {
        fontSize: 16,
        color: "#444",
        flex: 1,
        lineHeight: 24,
    },
    tipsContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: 20,
        padding: 20,
        margin: 15,
        marginTop: 5,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    tipIcon: {
        marginRight: 10,
        marginTop: 3,
    },
    tipText: {
        fontSize: 16,
        color: "#444",
        fontStyle: "italic",
        flex: 1,
        lineHeight: 22,
    },
});