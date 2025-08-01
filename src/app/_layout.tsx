import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import * as React from 'react';

export default function RootLayout() {
  return React.createElement(
    AuthProvider,
    null,
    React.createElement(
      Stack,
      null,
      React.createElement(Stack.Screen, { name: 'index', options: { title: 'Início' } }),
      React.createElement(Stack.Screen, { name: 'login', options: { title: 'Login' } }),
      React.createElement(Stack.Screen, { name: 'register', options: { title: 'Cadastro' } }),
      React.createElement(Stack.Screen, { name: 'recipes/index', options: { title: 'Receitas' } }),
      React.createElement(Stack.Screen, { name: 'recipes/[id]', options: { title: 'Detalhes da Receita' } }),
      React.createElement(Stack.Screen, { name: 'recipes/create-edit', options: { title: 'Criar/Editar Receita' } }),
      React.createElement(Stack.Screen, { name: 'profile', options: { title: 'Perfil' } }),
      React.createElement(Stack.Screen, { name: 'edit-profile', options: { title: 'Editar Perfil' } }),
      React.createElement(Stack.Screen, { name: 'about', options: { title: 'Sobre' } })
    )
  );
}
