import { supabase } from "../lib/supabaseClient";

export interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  image_url?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
  category: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  user_type: "comum" | "admin";
  created_at?: string;
  updated_at?: string;
}

export interface Favorite {
  id?: string;
  user_id: string;
  recipe_id: string;
  created_at?: string;
}

export const recipeService = {
  // Get all recipes for the current user
  async getUserRecipes(userId: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
        *,
        profiles (
          name,
          avatar_url
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        profiles (
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },


  async getRecipeById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
        *,
          profiles (
          name,
          avatar_url
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new recipe
  async createRecipe(
    recipe: Omit<Recipe, "id" | "created_at" | "updated_at">
  ): Promise<Recipe> {
    const { data, error } = await supabase
      .from("recipes")
      .insert([recipe])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update recipe
  async updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
    const { data, error } = await supabase
      .from("recipes")
      .update({ ...recipe, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete recipe
  async deleteRecipe(id: string): Promise<void> {
    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) throw error;
  },

  // Search recipes
  async searchRecipes(query: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
        *,
        profiles (
          name,
          avatar_url
        )
      `
      )
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Favorite operations
  async addToFavorites(userId: string, recipeId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from("favorites")
      .insert([{ user_id: userId, recipe_id: recipeId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromFavorites(userId: string, recipeId: string): Promise<void> {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("recipe_id", recipeId);

    if (error) throw error;
  },

  async getFavoriteRecipeIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("favorites")
      .select("recipe_id")
      .eq("user_id", userId);

    if (error) throw error;
    return data?.map(item => item.recipe_id) || [];
  },

  async getFavoriteRecipes(userId: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        recipes (
          *,
          profiles (
          name,
          avatar_url
        )
        )
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return (
      data?.map((item: any) => item.recipes as Recipe).filter(Boolean) || []
    );
  },

  async isFavorite(userId: string, recipeId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("recipe_id", recipeId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  },
};

export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Create or update profile
  async upsertProfile(
    profile: Omit<Profile, "id" | "created_at" | "updated_at">
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .upsert([profile])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile
  async updateProfile(
    userId: string,
    updates: Partial<Profile>
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};