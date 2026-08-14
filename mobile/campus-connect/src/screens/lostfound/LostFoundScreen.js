import React, { useCallback, useState } from "react";
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { lostFoundApi } from "../../api/lostFound";
import { BASE_URL } from "../../api/client";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import { colors, radius, spacing } from "../../theme/colors";

const FILTERS = ["All", "Lost", "Found"];

function resolveImage(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

export default function LostFoundScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await lostFoundApi.list();
      setReports(data);
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

  const visible = filter === "All" ? reports : reports.filter((r) => r.type === filter);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.screen}>
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.myPostsLink} onPress={() => navigation.navigate("MyPosts")}>
          <Text style={styles.myPostsText}>My posts</Text>
        </Pressable>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          error ? (
            <EmptyState icon="alert-circle-outline" title="Couldn't load reports" subtitle={error} />
          ) : (
            <EmptyState icon="search-outline" title="Nothing here yet" subtitle="Reports will show up as they're posted" />
          )
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("LostFoundDetail", { report: item })}>
            <Card style={styles.itemCard}>
              {item.imageUrl ? (
                <Image source={{ uri: resolveImage(item.imageUrl) }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Ionicons name="image-outline" size={24} color={colors.textMuted} />
                </View>
              )}
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: item.type === "Lost" ? colors.lost : colors.found },
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.type}</Text>
                  </View>
                  <Text style={styles.status}>{item.status}</Text>
                </View>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {item.category} · {item.location}
                </Text>
              </View>
            </Card>
          </Pressable>
        )}
      />

      <Pressable style={styles.fab} onPress={() => navigation.navigate("CreateLostFound")}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
  myPostsLink: {
    marginLeft: "auto",
  },
  myPostsText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  thumbPlaceholder: {
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  status: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 8,
    fontWeight: "600",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
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
