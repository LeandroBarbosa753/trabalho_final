import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function About() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <LinearGradient
      colors={["#ff9a9e", "#fad0c4", "#fad0c4"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3058/3058995.png",
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Sobre o ChefMaster</Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons
            name="person"
            size={32}
            color="#f4511e"
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Desenvolvimento</Text>
          <Text style={styles.text}>
            Este aplicativo foi desenvolvido por Leandro como parte de um
            projeto para explorar a integração de APIs em aplicativos React
            Native utilizando o Expo Router.
          </Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons
            name="api"
            size={32}
            color="#f4511e"
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Integração de API</Text>
          <Text style={styles.text}>
            Utilizamos a DummyJSON, que fornece dados fictícios de alta
            qualidade para testes e desenvolvimento de aplicações.
          </Text>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Recursos do Aplicativo</Text>

          <View style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Integração com API RESTful</Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Navegação com Expo Router</Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Interface responsiva</Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Design moderno e intuitivo</Text>
          </View>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.teamTitle}>Nossa Equipe</Text>

          <View style={styles.teamMember}>
            <Image
              source={{ uri: "https://i.postimg.cc/GhLWY4LC/perfil.png" }}
              style={styles.memberPhoto}
            />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Leandro</Text>
              <Text style={styles.memberRole}>Desenvolvedor</Text>
            </View>
          </View>
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Conecte-se comigo</Text>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openLink("https://github.com/LeandroBarbosa753")}
            >
              <View style={[styles.socialIcon, styles.githubIcon]}>
                <MaterialCommunityIcons name="github" size={28} color="white" />
              </View>
              <Text style={styles.socialButtonText}>GitHub</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() =>
                openLink("https://www.linkedin.com/in/leandrobarbosav/")
              }
            >
              <View style={[styles.socialIcon, styles.linkedinIcon]}>
                {/* Corrigido: usando MaterialCommunityIcons para o ícone linkedin */}
                <MaterialCommunityIcons
                  name="linkedin"
                  size={28}
                  color="white"
                />
              </View>
              <Text style={styles.socialButtonText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Versão 1.0.0</Text>
          <Text style={styles.footerText}>
            © 2025 ChefMaster - Todos os direitos reservados
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
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  icon: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f4511e",
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
  },
  featuresCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f4511e",
    textAlign: "center",
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 12,
  },
  teamContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 25,
  },
  teamTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f4511e",
    textAlign: "center",
    marginBottom: 20,
  },
  teamMember: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  memberRole: {
    fontSize: 16,
    color: "#555",
  },
  socialContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  socialTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f4511e",
    marginBottom: 20,
    textAlign: "center",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  socialButton: {
    alignItems: "center",
    width: "45%",
  },
  socialIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  githubIcon: {
    backgroundColor: "#333",
  },
  linkedinIcon: {
    backgroundColor: "#0077b5",
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 5,
  },
});
