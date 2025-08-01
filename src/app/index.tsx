import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Paleta de cores inspirada em comida (Chocolate e Laranja)
const Colors = {
  background: "#4A2E2A", // Marrom Chocolate Escuro
  primary: "#FF9800", // Laranja Vibrante
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.8)",
  buttonTextPrimary: "#4A2E2A",
  cardBackground: "rgba(0, 0, 0, 0.2)",
};

export default function Home() {
  // --- SUA LÓGICA ORIGINAL DE ANIMAÇÃO (NÃO MODIFICADA) ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  // --- FIM DA SUA LÓGICA ORIGINAL ---

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Ionicons name="restaurant" size={80} color={Colors.primary} />
          <Text style={styles.title}>Pitada Perfeita</Text>
          <Text style={styles.subtitle}>
            Explore, crie e compartilhe receitas.
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.actionsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Entre em sua Conta</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/register" asChild>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>Crie uma Nova Conta</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </View>
  );
}

// --- ESTILOS MODIFICADOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  mainContent: {
    flex: 3, // Ocupa a maior parte da tela
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.textPrimary,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.textSecondary,
    maxWidth: width * 0.7,
    marginTop: 10,
  },
  actionsContainer: {
    flex: 1, // Ocupa a parte inferior
    justifyContent: "flex-end", // Alinha os botões na parte de baixo
    paddingBottom: 20,
    gap: 15,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: Colors.buttonTextPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderColor: Colors.primary,
    borderWidth: 2,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});
