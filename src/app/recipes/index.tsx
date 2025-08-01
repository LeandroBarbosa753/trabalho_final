import * as React from "react";
import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
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
import { useAuth } from "../../context/AuthContext";
import { recipeService, Recipe } from "../../services/recipeService";
import { notificationService } from "../../services/notificationService";

// Paleta de cores reutilizada das outras páginas
const Colors = {
  background: "#4A2E2A", // Marrom Chocolate Escuro
  primary: "#FF9800", // Laranja Vibrante
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  cardBackground: "rgba(0, 0, 0, 0.2)",
  inputBackground: "rgba(0, 0, 0, 0.15)",
  inputPlaceholder: "rgba(255, 255, 255, 0.5)",
  tagBackground: "rgba(255, 152, 0, 0.2)",
  tagText: "#FF9800",
};

export default function Recipes() {
  // --- SUA LÓGICA ORIGINAL (NÃO MODIFICADA) ---
  const { user } = useAuth()!;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "favorites">("all");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let recipesToShow: Recipe[] = [];
      let favoriteIds: string[] = [];
      if (user) {
        favoriteIds = await recipeService.getFavoriteRecipeIds(user.id);
        setFavorites(new Set(favoriteIds));
      }
      if (viewMode === "favorites") {
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
      console.error("Error loading data:", err);
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
      if (viewMode === "favorites" && isFavorited) {
        setFilteredRecipes((currentRecipes) =>
          currentRecipes.filter((r) => r.id !== recipe.id)
        );
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
        loadData();
      }
      animateCards();
    } catch (err) {
      console.error("Search error:", err);
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    loadData();
    searchInputRef.current?.blur();
  };
  // --- FIM DA SUA LÓGICA ORIGINAL ---

  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    const isFavorited = favorites.has(item.id!);
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          onPress={() => router.push(`/recipes/${item.id}`)}
          style={styles.recipeCard}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri:
                item.image_url ||
                "https://placehold.co/100x100/FF9800/4A2E2A?text=Receita",
            }}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.recipeTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{item.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.cardAuthor}>
              Por: {item.user_name || "Chef Anônimo"}
            </Text>
            <View style={styles.cardFooter}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text style={styles.detailText}>
                  {item.prep_time + item.cook_time} min
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons
                  name="restaurant-outline"
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text style={styles.detailText}>{item.servings} porções</Text>
              </View>
              {user && (
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(item)}
                >
                  <Ionicons
                    name={isFavorited ? "heart" : "heart-outline"}
                    size={22}
                    color={isFavorited ? "#E91E63" : Colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={
          viewMode === "favorites"
            ? "heart-dislike-outline"
            : "fast-food-outline"
        }
        size={80}
        color={Colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>
        {viewMode === "favorites"
          ? "Nenhuma receita favorita"
          : "Nenhuma receita encontrada"}
      </Text>
      <Text style={styles.emptyText}>
        {viewMode === "favorites"
          ? "Toque no coração de uma receita para adicioná-la aqui."
          : "Tente buscar por outro termo ou adicione uma nova receita!"}
      </Text>
    </View>
  );

  if (error && !loading) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={60} color={Colors.primary} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pitada Perfeita</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.inputPlaceholder}
          style={styles.searchIcon}
        />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Buscar receitas..."
          placeholderTextColor={Colors.inputPlaceholder}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors.inputPlaceholder}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.sectionTitle}>RECEITAS RECENTES</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              viewMode === "all" && styles.filterButtonActive,
            ]}
            onPress={() => setViewMode("all")}
          >
            <Text
              style={[
                styles.filterButtonText,
                viewMode === "all" && styles.filterButtonTextActive,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              viewMode === "favorites" && styles.filterButtonActive,
            ]}
            onPress={() =>
              user
                ? setViewMode("favorites")
                : Alert.alert(
                    "Login Necessário",
                    "Você precisa fazer login para ver seus favoritos."
                  )
            }
          >
            <Text
              style={[
                styles.filterButtonText,
                viewMode === "favorites" && styles.filterButtonTextActive,
              ]}
            >
              Favoritas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ flex: 1 }}
        />
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderRecipeCard}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadData}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      {user && (
        <TouchableOpacity
          onPress={() => router.push("/recipes/create-edit")}
          style={styles.fab}
        >
          <Ionicons name="add" size={32} color={Colors.background} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// --- ESTILOS MODIFICADOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  clearIcon: {
    padding: 5,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary,
  },
  filterButtons: {
    flexDirection: "row",
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  filterButtonText: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: Colors.background,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  recipeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
    height: 80,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 5,
  },
  cardAuthor: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  detailText: {
    color: Colors.textSecondary,
    marginLeft: 5,
    fontSize: 12,
  },
  favoriteButton: {
    marginLeft: "auto",
    padding: 5,
  },
  difficultyBadge: {
    backgroundColor: Colors.tagBackground,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  difficultyText: {
    color: Colors.tagText,
    fontWeight: "bold",
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: "center",
    marginVertical: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
