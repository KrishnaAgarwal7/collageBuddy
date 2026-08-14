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

function resolveImage(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

export default function MyPostsScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await lostFoundApi.myPosts();
      setReports(data || []);
    } catch (e) {
      // Backend responds 404 when the user has no posts — treat as empty.
      setReports([]);
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
    <FlatList
      style={styles.screen}
      data={reports}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={
        <EmptyState
          icon="document-text-outline"
          title="You haven't posted anything yet"
          subtitle="Reports you create will show up here"
        />
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
                  style={[styles.badge, { backgroundColor: item.type === "Lost" ? colors.lost : colors.found }]}
                >
                  <Text style={styles.badgeText}>{item.type}</Text>
                </View>
                <Text style={styles.status}>{item.status}</Text>
              </View>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  itemCard: { flexDirection: "row", alignItems: "center" },
  thumb: { width: 56, height: 56, borderRadius: radius.md },
  thumbPlaceholder: { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  status: { fontSize: 11, color: colors.textMuted, marginLeft: 8, fontWeight: "600" },
  title: { fontSize: 15, fontWeight: "700", color: colors.text },
});
