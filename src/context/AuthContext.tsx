import * as React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { profileService, Profile } from '@/services/recipeService';

interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const userProfile = await profileService.getProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

    const signUp = async (email: string, password: string, name: string) => {
    // A chamada para supabase.auth.signUp continua a mesma
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    
    if (error) throw error;
    
    // REMOVA OU COMENTE O BLOCO DE CÓDIGO ABAIXO
    // O gatilho no Supabase já está cuidando da criação do perfil.
    /*
    if (data.user) {
      try {
        await profileService.upsertProfile({
          user_id: data.user.id,
          name: name,
          email: email,
          user_type: 'comum',
        });
      } catch (profileError) {
        console.error('Error creating profile:', profileError);
        // Lançar o erro de perfil pode ser útil para debug, mas vamos removê-lo
        // para não mascarar o sucesso do cadastro.
        // throw profileError; 
      }
    }
    */
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      await loadProfile(session.user.id);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('User not authenticated');
    
    const updatedProfile = await profileService.updateProfile(user.id, updates);
    setProfile(updatedProfile);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, profile, loading, signIn, signUp, signOut, refreshUser, updateProfile } },
    children
  );
};

export const useAuth = () => useContext(AuthContext);
