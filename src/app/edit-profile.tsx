import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
  const { user, profile, updateProfile } = useAuth()!;
  const router = useRouter();
  const [name, setName] = React.useState(profile?.name || '');
  const [bio, setBio] = React.useState(profile?.bio || '');
  const [avatarUri, setAvatarUri] = React.useState(profile?.avatar_url || '');
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        avatar_url: avatarUri,
      });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar imagem');
    }
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
        React.createElement(Text, { style: styles.title }, 'Editar Perfil'),
        React.createElement(Text, { style: styles.subtitle }, 'Atualize suas informações')
      ),
      React.createElement(
        View,
        { style: styles.form },
        React.createElement(
          View,
          { style: styles.avatarSection },
          React.createElement(
            TouchableOpacity,
            { style: styles.avatarButton, onPress: handleImagePicker },
            avatarUri ? React.createElement(
              View,
              { style: styles.avatarContainer },
              React.createElement(Image, { 
                source: { uri: avatarUri }, 
                style: styles.avatar 
              }),
              React.createElement(
                View,
                { style: styles.avatarOverlay },
                React.createElement(Ionicons, {
                  name: 'camera-outline',
                  size: 24,
                  color: '#fff'
                })
              )
            ) : React.createElement(
              View,
              { style: styles.avatarPlaceholder },
              React.createElement(Ionicons, {
                name: 'person-outline',
                size: 40,
                color: '#667eea'
              }),
              React.createElement(Text, { style: styles.avatarPlaceholderText }, 'Adicionar Foto')
            )
          )
        ),
        React.createElement(Text, { style: styles.label }, 'Nome *'),
        React.createElement(
          View,
          { style: styles.inputContainer },
          React.createElement(Ionicons, {
            name: 'person-outline',
            size: 20,
            color: '#667eea',
            style: styles.inputIcon
          }),
          React.createElement(TextInput, {
            style: styles.input,
            placeholder: 'Seu nome completo',
            value: name,
            onChangeText: setName,
            placeholderTextColor: '#999',
            autoCapitalize: 'words',
          })
        ),
        React.createElement(Text, { style: styles.label }, 'E-mail'),
        React.createElement(
          View,
          { style: [styles.inputContainer, styles.inputDisabled] },
          React.createElement(Ionicons, {
            name: 'mail-outline',
            size: 20,
            color: '#ccc',
            style: styles.inputIcon
          }),
          React.createElement(TextInput, {
            style: [styles.input, styles.inputTextDisabled],
            value: profile?.email || user.email,
            editable: false,
            placeholderTextColor: '#ccc',
          })
        ),
        React.createElement(Text, { style: styles.helperText }, 'O e-mail não pode ser alterado'),
        React.createElement(Text, { style: styles.label }, 'Bio'),
        React.createElement(
          View,
          { style: styles.inputContainer },
          React.createElement(Ionicons, {
            name: 'document-text-outline',
            size: 20,
            color: '#667eea',
            style: styles.inputIcon
          }),
          React.createElement(TextInput, {
            style: [styles.input, styles.textArea],
            placeholder: 'Conte um pouco sobre você...',
            value: bio,
            onChangeText: setBio,
            multiline: true,
            numberOfLines: 4,
            placeholderTextColor: '#999',
          })
        ),
        React.createElement(
          View,
          { style: styles.userTypeContainer },
          React.createElement(Text, { style: styles.label }, 'Tipo de Usuário'),
          React.createElement(
            View,
            { style: styles.userTypeBadge },
            React.createElement(Ionicons, {
              name: profile?.user_type === 'admin' ? 'shield-checkmark' : 'person',
              size: 16,
              color: profile?.user_type === 'admin' ? '#dc2626' : '#059669'
            }),
            React.createElement(Text, { 
              style: [
                styles.userTypeText,
                { color: profile?.user_type === 'admin' ? '#dc2626' : '#059669' }
              ] 
            }, profile?.user_type === 'admin' ? 'Administrador' : 'Usuário Comum')
          )
        ),
        React.createElement(
          TouchableOpacity,
          { 
            style: [styles.saveButton, loading && styles.saveButtonDisabled], 
            onPress: handleSave,
            disabled: loading
          },
          React.createElement(
            LinearGradient,
            {
              colors: loading ? ['#ccc', '#999'] : ['#10b981', '#059669'],
              style: styles.saveButtonGradient
            },
            loading ? React.createElement(Ionicons, {
              name: 'hourglass-outline',
              size: 24,
              color: '#fff'
            }) : React.createElement(Ionicons, {
              name: 'checkmark-outline',
              size: 24,
              color: '#fff'
            }),
            React.createElement(Text, { style: styles.saveButtonText }, 
              loading ? 'Salvando...' : 'Salvar Alterações'
            )
          )
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarButton: {
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  inputTextDisabled: {
    color: '#94a3b8',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontStyle: 'italic',
  },
  userTypeContainer: {
    marginTop: 8,
  },
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
