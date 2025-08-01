import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth()!;
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/login');
            } catch (error: any) {
              Alert.alert('Erro', error.message);
            }
          }
        }
      ]
    );
  };

  if (!user) {
    router.replace('/login');
    return null;
  }

  return React.createElement(
    LinearGradient,
    { 
      colors: ['#667eea', '#764ba2', '#f093fb'], 
      style: styles.container,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 }
    },
    React.createElement(
      ScrollView,
      { 
        contentContainerStyle: styles.scrollContainer,
        showsVerticalScrollIndicator: false
      },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          { style: styles.avatarContainer },
          profile?.avatar_url ? React.createElement(Image, {
            source: { uri: profile.avatar_url },
            style: styles.avatar,
          }) : React.createElement(
            View,
            { style: styles.avatarPlaceholder },
            React.createElement(Ionicons, {
              name: 'person-outline',
              size: 40,
              color: '#667eea'
            })
          )
        ),
        React.createElement(Text, { style: styles.name }, profile?.name || user.user_metadata?.name || 'Usuário'),
        React.createElement(Text, { style: styles.email }, profile?.email || user.email),
        profile?.bio && React.createElement(Text, { style: styles.bio }, profile.bio),
        React.createElement(
          View,
          { style: styles.roleBadge },
          React.createElement(Ionicons, {
            name: profile?.user_type === 'admin' ? 'shield-checkmark' : 'person',
            size: 16,
            color: profile?.user_type === 'admin' ? '#dc2626' : '#10b981'
          }),
          React.createElement(Text, { 
            style: [
              styles.roleText,
              { color: profile?.user_type === 'admin' ? '#dc2626' : '#10b981' }
            ] 
          }, profile?.user_type === 'admin' ? 'Administrador' : 'Usuário Comum')
        ),
        React.createElement(
          TouchableOpacity,
          { 
            style: styles.editButton,
            onPress: () => router.push('/edit-profile')
          },
          React.createElement(
            LinearGradient,
            {
              colors: ['#10b981', '#059669'],
              style: styles.editButtonGradient
            },
            React.createElement(Ionicons, {
              name: 'create-outline',
              size: 20,
              color: '#fff'
            }),
            React.createElement(Text, { style: styles.editButtonText }, 'Editar Perfil')
          )
        )
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Minhas Receitas'),
        React.createElement(
          View,
          { style: styles.statsContainer },
          React.createElement(
            View,
            { style: styles.statItem },
            React.createElement(Text, { style: styles.statNumber }, '0'),
            React.createElement(Text, { style: styles.statLabel }, 'Receitas Criadas')
          ),
          React.createElement(
            View,
            { style: styles.statItem },
            React.createElement(Text, { style: styles.statNumber }, '0'),
            React.createElement(Text, { style: styles.statLabel }, 'Favoritas')
          )
        )
      ),
      React.createElement(
        TouchableOpacity,
        { style: styles.logoutButton, onPress: handleLogout },
        React.createElement(
          LinearGradient,
          {
            colors: ['#ef4444', '#dc2626'],
            style: styles.logoutButtonGradient
          },
          React.createElement(Ionicons, {
            name: 'log-out-outline',
            size: 20,
            color: '#fff'
          }),
          React.createElement(Text, { style: styles.logoutButtonText }, 'Sair da Conta')
        )
      )
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: width * 0.8,
    lineHeight: 20,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  editButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  editButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  logoutButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
