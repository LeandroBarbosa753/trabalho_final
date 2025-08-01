import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

export default function Home() {
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

  return React.createElement(
    LinearGradient,
    { 
      colors: ["#667eea", "#764ba2", "#f093fb"], 
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
        Animated.View,
        {
          style: [
            styles.header,
            { 
              opacity: fadeAnim, 
              transform: [{ scale: scaleAnim }] 
            }
          ]
        },
        React.createElement(
          View,
          { style: styles.logoContainer },
          React.createElement(
            LinearGradient,
            {
              colors: ["#ff9a9e", "#fecfef", "#fecfef"],
              style: styles.logoGradient,
              start: { x: 0, y: 0 },
              end: { x: 1, y: 1 }
            },
            React.createElement(Ionicons, { 
              name: "restaurant", 
              size: 60, 
              color: "#fff" 
            })
          )
        ),
        React.createElement(Text, { style: styles.title }, "Meu Livro de Receitas"),
        React.createElement(Text, { style: styles.subtitle }, 
          "Crie, compartilhe e descubra receitas incríveis feitas por você e outros chefs!"
        )
      ),
       React.createElement(
        Animated.View,
        {
          style: [
            styles.actionsContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]
        },
        React.createElement(
          Link,
          { href: "/login", asChild: true }, 
          React.createElement(
            TouchableOpacity,
            { style: styles.primaryButton, activeOpacity: 0.8 },
            React.createElement(
              LinearGradient,
              {
                colors: ["#ff6b6b", "#ee5a24"],
                style: styles.buttonGradient,
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 }
              },
              React.createElement(Ionicons, { 
                name: "log-in-outline", 
                size: 24, 
                color: "white" 
              }),
              React.createElement(Text, { style: styles.primaryButtonText }, "Entrar")
            )
          )
        ),
        React.createElement(
          Link,
          { href: "/register", asChild: true },
          React.createElement(
            TouchableOpacity,
            { style: styles.secondaryButton, activeOpacity: 0.8 },
            React.createElement(Ionicons, { 
              name: "person-add-outline", 
              size: 24, 
              color: "#fff" 
            }),
            React.createElement(Text, { style: styles.secondaryButtonText }, "Criar Conta")
          )
        )
      ),
      React.createElement(
        Animated.View,
        {
          style: [
            styles.featuresContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]
        },
        React.createElement(Text, { style: styles.featuresTitle }, "O que você pode fazer:"),
        React.createElement(
          View,
          { style: styles.featuresGrid },
          React.createElement(
            View,
            { style: styles.featureCard },
            React.createElement(
              LinearGradient,
              {
                colors: ["#a8edea", "#fed6e3"],
                style: styles.featureGradient
              },
              React.createElement(Ionicons, { 
                name: "add-circle-outline", 
                size: 32, 
                color: "#2d3436" 
              }),
              React.createElement(Text, { style: styles.featureText }, "Criar Receitas")
            )
          ),
          React.createElement(
            View,
            { style: styles.featureCard },
            React.createElement(
              LinearGradient,
              {
                colors: ["#ffecd2", "#fcb69f"],
                style: styles.featureGradient
              },
              React.createElement(Ionicons, { 
                name: "heart-outline", 
                size: 32, 
                color: "#2d3436" 
              }),
              React.createElement(Text, { style: styles.featureText }, "Favoritar")
            )
          ),
          React.createElement(
            View,
            { style: styles.featureCard },
            React.createElement(
              LinearGradient,
              {
                colors: ["#d299c2", "#fef9d7"],
                style: styles.featureGradient
              },
              React.createElement(Ionicons, { 
                name: "search-outline", 
                size: 32, 
                color: "#2d3436" 
              }),
              React.createElement(Text, { style: styles.featureText }, "Buscar")
            )
          ),
          React.createElement(
            View,
            { style: styles.featureCard },
            React.createElement(
              LinearGradient,
              {
                colors: ["#89f7fe", "#66a6ff"],
                style: styles.featureGradient
              },
              React.createElement(Ionicons, { 
                name: "share-social-outline", 
                size: 32, 
                color: "#2d3436" 
              }),
              React.createElement(Text, { style: styles.featureText }, "Compartilhar")
            )
          )
        )
      ),
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.footerText }, 
          "Transforme sua cozinha em um laboratório de sabores! 👨‍🍳✨"
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    color: "#fff",
    marginBottom: 15,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
    maxWidth: width * 0.85,
    lineHeight: 24,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionsContainer: {
    marginBottom: 50,
    gap: 15,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 25,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  featureCard: {
    width: (width - 55) / 2,
    height: 120,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  featureGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    gap: 8,
  },
  featureText: {
    color: "#2d3436",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
