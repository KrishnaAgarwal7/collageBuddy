import React, { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { eventsApi } from "../../api/events";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import { colors, radius, spacing } from "../../theme/colors";

const TYPE_COLORS = {
  hackathon: "#4F46E5",
  workshop: "#0EA5E9",
  competition: "#DC2626",
  seminar: "#16A34A",
  other: "#64748B",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function EventsScreen({ navigation }) {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await eventsApi.list();
      setEvents(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.screen}>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          error ? (
            <EmptyState icon="alert-circle-outline" title="Couldn't load events" subtitle={error} />
          ) : (
            <EmptyState icon="calendar-outline" title="No events yet" subtitle="Check back soon" />
          )
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("EventDetail", { event: item })}>
            <Card>
              <View style={styles.row}>
                <View style={[styles.badge, { backgroundColor: TYPE_COLORS[item.type] || TYPE_COLORS.other }]}>
                  <Text style={styles.badgeText}>{item.type}</Text>
                </View>
                <Text style={styles.date}>{formatDate(item.eventDate)}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              {item.organizer ? <Text style={styles.organizer}>by {item.organizer}</Text> : null}
              {item.location ? (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.location}>{item.location}</Text>
                </View>
              ) : null}
            </Card>
          </Pressable>
        )}
      />
      {isAdmin ? (
        <Pressable style={styles.fab} onPress={() => navigation.navigate("EventForm", {})}>
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    textTransform: "capitalize",
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  organizer: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: 4,
  },
  location: {
    fontSize: 13,
    color: colors.textMuted,
    marginLeft: 4,
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
