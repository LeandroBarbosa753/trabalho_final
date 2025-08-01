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
import { useAuth } from "../../context/AuthContext";

// Paleta de cores padronizada, baseada no index.tsx
const Colors = {
  background: "#4A2E2A", // Marrom Chocolate Escuro
  primary: "#FF9800", // Laranja Vibrante
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.8)",
  cardBackground: "rgba(0, 0, 0, 0.2)",
  inputBackground: "rgba(0, 0, 0, 0.15)",
  danger: "#e74c3c", // Vermelho para ações destrutivas
};

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth()!;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") {
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
              Alert.alert(
                "Erro",
                "Não foi possível apagar a receita: " + error.message
              );
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
        colors={[Colors.background, "#6b4a44"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando receita...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={[Colors.background, "#6b4a44"]}
        style={styles.loadingContainer}
      >
        <View style={styles.errorCard}>
          <MaterialIcons
            name="error-outline"
            size={60}
            color={Colors.primary}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!recipe) {
    return (
      <LinearGradient
        colors={[Colors.background, "#6b4a44"]}
        style={styles.loadingContainer}
      >
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>Receita não encontrada</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.background, "#6b4a44"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {recipe.image_url && (
          <Image
            source={{
              uri:
                recipe.image_url ||
                "https://placehold.co/400x300/FF9800/4A2E2A?text=Receita",
            }}
            style={styles.image}
          />
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
        </View>

        <View style={styles.metadataContainer}>
          <View style={styles.metadataItem}>
            <MaterialIcons name="timer" size={20} color={Colors.primary} />
            <Text style={styles.metadataText}>
              {recipe.prep_time + recipe.cook_time} min
            </Text>
          </View>
          <View style={styles.metadataItem}>
            <MaterialIcons name="restaurant" size={20} color={Colors.primary} />
            <Text style={styles.metadataText}>{recipe.servings} porções</Text>
          </View>
          <View style={styles.metadataItem}>
            <MaterialIcons
              name="signal-cellular-alt"
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.metadataText}>{recipe.difficulty}</Text>
          </View>
        </View>

        {isOwner && (
          <View style={styles.ownerActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                router.push(`/recipes/create-edit?id=${recipe.id}`)
              }
            >
              <MaterialIcons name="edit" size={20} color={Colors.background} />
              <Text style={styles.ownerButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <MaterialIcons
                name="delete"
                size={20}
                color={Colors.textPrimary}
              />
              <Text style={styles.ownerButtonText}>Apagar</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="list-alt" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Ingredientes</Text>
          </View>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <MaterialIcons
                name="fiber-manual-record"
                size={10}
                color={Colors.primary}
                style={styles.bullet}
              />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="menu-book" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          </View>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tipsContainer}>
          <MaterialIcons
            name="lightbulb-outline"
            size={24}
            color={Colors.primary}
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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 20,
    fontWeight: "600",
  },
  errorCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 15,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 300,
  },
  headerContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 152, 0, 0.2)",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "bold",
  },
  metadataContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  metadataItem: {
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    minWidth: 100,
  },
  metadataText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 5,
  },
  ownerActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.danger,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
  },
  ownerButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  section: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBackground,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginLeft: 10,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  bullet: {
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 24,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  stepNumber: {
    backgroundColor: Colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    marginTop: 2,
  },
  stepText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 24,
  },
  tipsContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  tipIcon: {
    marginRight: 15,
  },
  tipText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontStyle: "italic",
    flex: 1,
    lineHeight: 22,
  },
});
