import * as React from 'react';
import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import { recipeService, Recipe } from "../../services/recipeService";
import { notificationService } from '../../services/notificationService';

export default function Recipes() {
  const { user } = useAuth()!;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let recipesToShow: Recipe[] = [];
      let favoriteIds: string[] = [];

      // Carrega os favoritos apenas se o usuário estiver logado
      if (user) {
        favoriteIds = await recipeService.getFavoriteRecipeIds(user.id);
        setFavorites(new Set(favoriteIds));
      }

      // Decide quais receitas buscar com base no filtro
      if (viewMode === 'favorites') {
        if (!user) {
          setError("Você precisa estar logado para ver seus favoritos.");
          setFilteredRecipes([]);
          return;
        }
        recipesToShow = await recipeService.getFavoriteRecipes(user.id);
      } else {
        recipesToShow = await recipeService.getAllRecipes();
      }

      setRecipes(recipesToShow);
      setFilteredRecipes(recipesToShow);
      animateCards();

    } catch (err: any) {
      setError("Erro ao carregar receitas. Verifique sua conexão.");
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, viewMode]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const animateCards = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };
  
  const toggleFavorite = async (recipe: Recipe) => {
    if (!user || !recipe.id) return;

    const isFavorited = favorites.has(recipe.id);
    const updatedFavorites = new Set(favorites);

    try {
      if (isFavorited) {
        updatedFavorites.delete(recipe.id);
        await recipeService.removeFromFavorites(user.id, recipe.id);
      } else {
        updatedFavorites.add(recipe.id);
        await recipeService.addToFavorites(user.id, recipe.id);
        await notificationService.notifyRecipeFavorited(recipe.title);
      }
      setFavorites(updatedFavorites);
      
      if (viewMode === 'favorites' && isFavorited) {
        setFilteredRecipes(currentRecipes => currentRecipes.filter(r => r.id !== recipe.id));
      }

    } catch (error) {
        setFavorites(new Set(favorites));
        Alert.alert("Erro", "Não foi possível atualizar os favoritos.");
    }
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      if (search.trim()) {
        const searchResults = await recipeService.searchRecipes(search.trim());
        setFilteredRecipes(searchResults);
      } else {
        // Quando limpa a busca, volta para a lista baseada no viewMode
        loadData(); 
      }
      animateCards();
    } catch (err) {
      console.error('Search error:', err);
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setFilteredRecipes(recipes);
    animateCards();
    searchInputRef.current?.blur();
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    const isFavorited = favorites.has(item.id!);
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
        <TouchableOpacity
          onPress={() => router.push(`/recipes/${item.id}`)}
          style={styles.recipeCard}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={{ uri: item.image_url || 'https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-permanentes/cindra/imagens/sem.jpg.gif/image_large' }}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientOverlay}
            />
            {user && (
                 <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item)}>
                    <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={28} color={isFavorited ? "#ff6b6b" : "#fff"} />
                </TouchableOpacity>
            )}
            <View style={styles.textContainer}>
                <View>
                    <Text style={styles.recipeCategory}>{item.category.toUpperCase()}</Text>
                    <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color="#fff" />
                        <Text style={styles.detailText}>{item.prep_time + item.cook_time} min</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="restaurant-outline" size={16} color="#fff" />
                        <Text style={styles.detailText}>{item.servings} porções</Text>
                    </View>
                    <View style={[styles.difficultyBadge, styles[`${item.difficulty.toLowerCase()}Badge`]]}>
                        <Text style={styles.difficultyText}>{item.difficulty}</Text>
                    </View>
                </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
        <Ionicons name={viewMode === 'favorites' ? "heart-dislike-outline" : "fast-food-outline"} size={80} color="rgba(255,255,255,0.7)" style={styles.emptyIcon} />
        <Text style={styles.emptyTitle}>
            {viewMode === 'favorites' ? "Nenhuma receita favorita" : "Nenhuma receita encontrada"}
        </Text>
        <Text style={styles.emptyText}>
            {viewMode === 'favorites' 
                ? "Toque no coração de uma receita para adicioná-la aqui."
                : "Seja o primeiro a compartilhar uma delícia ou tente buscar por outro termo."}
        </Text>
    </View>
  );

  if (error && !loading) {
    return (
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.errorGradient}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={60} color="#fff" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Receitas</Text>
          <Text style={styles.headerSubtitle}>Descubra novos sabores</Text>
        </View>
        {user && (
          <TouchableOpacity onPress={() => router.push('/recipes/create-edit')} style={styles.addButton}>
            <LinearGradient colors={["#ff6b6b", "#ee5a24"]} style={styles.addButtonGradient}>
              <Ionicons name="add" size={30} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color="#667eea" style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Buscar por título, categoria..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={22} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
            style={[styles.filterButton, viewMode === 'all' && styles.filterButtonActive]} 
            onPress={() => setViewMode('all')}>
            <Text style={[styles.filterButtonText, viewMode === 'all' && styles.filterButtonTextActive]}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.filterButton, viewMode === 'favorites' && styles.filterButtonActive]} 
            onPress={() => user ? setViewMode('favorites') : Alert.alert("Login Necessário", "Você precisa fazer login para ver seus favoritos.")}>
            <Text style={[styles.filterButtonText, viewMode === 'favorites' && styles.filterButtonTextActive]}>Favoritas</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando receitas...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderRecipeCard}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor="#fff" />}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "900",
        color: "#fff",
        textShadowColor: "rgba(0,0,0,0.2)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "rgba(255,255,255,0.8)",
        textShadowColor: "rgba(0,0,0,0.1)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    addButton: {
        borderRadius: 25,
        overflow: "hidden",
    },
    addButtonGradient: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 16,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginBottom: 10,
        height: 50,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: "100%",
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    clearIcon: {
        padding: 5,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    filterButtonActive: {
        backgroundColor: '#fff',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    filterButtonTextActive: {
        color: '#667eea',
    },
    recipeCard: {
        height: 250,
        borderRadius: 20,
        overflow: 'hidden',
        marginHorizontal: 20,
        marginBottom: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        backgroundColor: '#ccc',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },
    textContainer: {
        padding: 16,
        justifyContent: 'space-between',
        flex: 1,
    },
    favoriteButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        borderRadius: 20,
        zIndex: 1,
    },
    recipeCategory: {
        fontSize: 12,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.9)',
        letterSpacing: 1,
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    recipeTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    detailsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 'auto',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.35)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    detailText: {
        color: '#fff',
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '700',
    },
    difficultyBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    fácilBadge: { backgroundColor: '#10b981' },
    médioBadge: { backgroundColor: '#f59e0b' },
    difícilBadge: { backgroundColor: '#ef4444' },
    difficultyText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 60,
    },
    emptyIcon: {
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 12,
        textAlign: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "rgba(255,255,255,0.9)",
        textAlign: "center",
        lineHeight: 22,
        maxWidth: 280,
        marginBottom: 30,
    },
    createButton: {
        borderRadius: 25,
        overflow: "hidden",
    },
    createButtonGradient: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    createButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
    clearButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 20,
    },
    clearButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    errorGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        padding: 32,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginVertical: 20,
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#ff6b6b',
        borderRadius: 16,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#fff',
    },
    listContent: {
        paddingBottom: 40,
        paddingTop: 10,
    },
    resultsText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    resultsCount: {
        fontWeight: '600',
    },
});