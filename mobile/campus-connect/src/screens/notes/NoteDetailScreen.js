import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/Button";
import { colors, radius, spacing } from "../../theme/colors";

export default function NoteDetailScreen({ route }) {
  const { resource } = route.params;
  const link = resource.resourceType === "file" ? resource.fileUrl : resource.externalLink;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={styles.iconCircle}>
        <Ionicons
          name={resource.resourceType === "file" ? "document-outline" : "link-outline"}
          size={28}
          color={colors.primary}
        />
      </View>

      <Text style={styles.title}>{resource.title}</Text>
      <Text style={styles.meta}>
        {resource.courseId} · Semester {resource.semester}
      </Text>

      {resource.description ? <Text style={styles.description}>{resource.description}</Text> : null}

      {resource.uploadedBy?.name ? (
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color={colors.textMuted} />
          <Text style={styles.infoText}>Shared by {resource.uploadedBy.name}</Text>
        </View>
      ) : null}

      {link ? (
        <Button
          title={resource.resourceType === "file" ? "Open file" : "Open link"}
          onPress={() => Linking.openURL(link)}
          style={{ marginTop: spacing.lg }}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textMuted,
    marginLeft: 6,
  },
});
