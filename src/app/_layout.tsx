import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import * as React from "react";

// Paleta de cores para consistência
const Colors = {
  background: "#4A2E2A",
  textPrimary: "#FFFFFF",
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          // Estilo padrão para todos os cabeçalhos
          headerStyle: {
            backgroundColor: Colors.background,
          },
          // Cor do título e do botão de voltar
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // Remove a linha/sombra abaixo do cabeçalho
          headerShadowVisible: false,
        }}
      >
        {/* Telas que usarão o cabeçalho estilizado */}
        <Stack.Screen name="index" options={{ title: "Início" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Cadastro" }} />
        <Stack.Screen
          name="recipes/[id]"
          options={{ title: "Detalhes da Receita" }}
        />
        <Stack.Screen
          name="recipes/create-edit"
          options={{ title: "Criar ou Editar Receita" }}
        />
        <Stack.Screen name="profile" options={{ title: "Perfil" }} />
        <Stack.Screen
          name="edit-profile"
          options={{ title: "Editar Perfil" }}
        />
        <Stack.Screen name="about" options={{ title: "Sobre" }} />

        {/* A tela de receitas principal não terá cabeçalho, pois já possui um customizado */}
        <Stack.Screen name="recipes/index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
