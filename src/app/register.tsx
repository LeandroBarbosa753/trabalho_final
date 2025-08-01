import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Link as ExpoLink, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext"; // Sua lógica de autenticação original
import { Ionicons } from "@expo/vector-icons";

// Paleta de cores inspirada em comida (Chocolate e Laranja)
const Colors = {
  background: "#4A2E2A", // Marrom Chocolate Escuro
  primary: "#FF9800", // Laranja Vibrante
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.8)",
  buttonTextPrimary: "#4A2E2A",
  inputBackground: "rgba(0, 0, 0, 0.2)",
  inputPlaceholder: "#BDBDBD",
};

export default function RegisterScreen() {
  // --- SUA LÓGICA ORIGINAL (NÃO MODIFICADA) ---
  const { signUp } = useAuth();
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, name);
      Alert.alert(
        "Cadastro realizado!",
        "Sua conta foi criada com sucesso. Faça login para continuar.",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.";
      Alert.alert("Erro no Cadastro", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // --- FIM DA SUA LÓGICA ORIGINAL ---

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Ionicons
            name="person-add-outline"
            size={60}
            color={Colors.primary}
          />
          <Text style={styles.title}>Crie sua Conta</Text>
          <Text style={styles.subtitle}>Junte-se à comunidade de chefs!</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={22}
              color={Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.inputPlaceholder}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={22}
              color={Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={Colors.inputPlaceholder}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha (mín. 6 caracteres)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={Colors.inputPlaceholder}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={Colors.buttonTextPrimary}
              />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <ExpoLink href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Faça login</Text>
            </TouchableOpacity>
          </ExpoLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- ESTILOS MODIFICADOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    marginVertical: 8,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    height: 55,
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#FFB74D",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.buttonTextPrimary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  linkText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "bold",
  },
});
