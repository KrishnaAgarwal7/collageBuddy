import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/Card";
import { colors, radius, spacing } from "../../theme/colors";

const QUICK_LINKS = [
  { key: "Events", label: "Events", icon: "calendar-outline", color: "#4F46E5" },
  { key: "LostFound", label: "Lost & Found", icon: "search-outline", color: "#0EA5E9" },
  { key: "Notes", label: "Notes & Resources", icon: "document-text-outline", color: "#16A34A" },
  { key: "Profile", label: "Profile", icon: "person-outline", color: "#D97706" },
];

export default function HomeScreen({ navigation }) {
  const { user, isAdmin } = useAuth();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.greeting}>Hi {user?.name?.split(" ")[0] || "there"} 👋</Text>
      <Text style={styles.subtitle}>
        {user?.branch ? `${user.branch} · Sem ${user.currentSem}` : "Welcome to Campus Connect"}
      </Text>

      {isAdmin ? (
        <Card style={styles.adminBanner}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
          <Text style={styles.adminBannerText}>You're signed in as an admin</Text>
        </Card>
      ) : null}

      <View style={styles.grid}>
        {QUICK_LINKS.map((item) => (
          <Pressable
            key={item.key}
            style={styles.gridItem}
            onPress={() => navigation.navigate(item.key)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={24} color="#fff" />
            </View>
            <Text style={styles.gridLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <Card>
        <Text style={styles.cardText}>
          Campus Connect brings together events, lost & found reports, and shared study
          resources for IIITG students in one place.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  adminBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
  },
  adminBannerText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  gridItem: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  cardText: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
