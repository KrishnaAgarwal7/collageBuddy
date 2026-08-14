import React from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../../api/client";
import Button from "../../components/Button";
import { colors, radius, spacing } from "../../theme/colors";

function resolveImage(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

export default function LostFoundDetailScreen({ route }) {
  const { report } = route.params;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg }}>
      {report.imageUrl ? (
        <Image source={{ uri: resolveImage(report.imageUrl) }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={40} color={colors.textMuted} />
        </View>
      )}

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: report.type === "Lost" ? colors.lost : colors.found }]}>
          <Text style={styles.badgeText}>{report.type}</Text>
        </View>
        <Text style={styles.status}>{report.status}</Text>
      </View>

      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.category}>{report.category}</Text>

      <View style={styles.infoBlock}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={colors.textMuted} />
          <Text style={styles.infoText}>{report.location}</Text>
        </View>
        {report.postedBy?.name ? (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color={colors.textMuted} />
            <Text style={styles.infoText}>{report.postedBy.name}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{report.description}</Text>

      {report.contactNumber ? (
        <Button
          title={`Call ${report.contactNumber}`}
          onPress={() => Linking.openURL(`tel:${report.contactNumber}`)}
          style={{ marginTop: spacing.lg }}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  image: {
    width: "100%",
    height: 220,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  imagePlaceholder: {
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  status: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 8,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  category: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  infoBlock: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
});
