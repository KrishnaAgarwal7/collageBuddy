import React, { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { eventsApi } from "../../api/events";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import { colors, radius, spacing } from "../../theme/colors";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;
  const { isAdmin } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const onDelete = () => {
    Alert.alert("Delete event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await eventsApi.remove(event._id);
            navigation.goBack();
          } catch (e) {
            Alert.alert("Error", e.message);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{event.type}</Text>
      </View>
      <Text style={styles.title}>{event.title}</Text>
      {event.organizer ? <Text style={styles.organizer}>Organized by {event.organizer}</Text> : null}

      <View style={styles.infoBlock}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
          <Text style={styles.infoText}>{formatDate(event.eventDate)}</Text>
        </View>
        {event.registrationDeadline ? (
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={colors.textMuted} />
            <Text style={styles.infoText}>Register by {formatDate(event.registrationDeadline)}</Text>
          </View>
        ) : null}
        {event.location ? (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.textMuted} />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>
        ) : null}
      </View>

      {event.description ? (
        <>
          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </>
      ) : null}

      {event.registrationUrl ? (
        <Button
          title="Register"
          onPress={() => Linking.openURL(event.registrationUrl)}
          style={{ marginTop: spacing.lg }}
        />
      ) : null}

      {isAdmin ? (
        <View style={styles.adminRow}>
          <Button
            title="Edit"
            variant="outline"
            onPress={() => navigation.navigate("EventForm", { event })}
            style={{ flex: 1, marginRight: spacing.sm }}
          />
          <Button
            title="Delete"
            variant="danger"
            loading={deleting}
            onPress={onDelete}
            style={{ flex: 1 }}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  organizer: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  infoBlock: {
    marginTop: spacing.lg,
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
  adminRow: {
    flexDirection: "row",
    marginTop: spacing.xl,
  },
});
