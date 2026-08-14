import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { notesApi } from "../../api/notes";
import Card from "../../components/Card";
import Input from "../../components/Input";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import { colors, radius, spacing } from "../../theme/colors";

export default function NotesScreen({ navigation }) {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (searchTerm) => {
    try {
      setError(null);
      const data = await notesApi.list(searchTerm ? { search: searchTerm } : {});
      setResources(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(search);
    }, [load])
  );

  // Debounce search input.
  useEffect(() => {
    const timer = setTimeout(() => load(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const onRefresh = () => {
    setRefreshing(true);
    load(search);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.searchWrap}>
        <Input
          placeholder="Search notes, past papers, courses..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            error ? (
              <EmptyState icon="alert-circle-outline" title="Couldn't load resources" subtitle={error} />
            ) : (
              <EmptyState
                icon="document-text-outline"
                title="No resources found"
                subtitle="Try a different search, or upload one yourself"
              />
            )
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate("NoteDetail", { resource: item })}>
              <Card style={styles.row}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={item.resourceType === "file" ? "document-outline" : "link-outline"}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.meta}>
                    {item.courseId} · Sem {item.semester}
                  </Text>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}

      <Pressable style={styles.fab} onPress={() => navigation.navigate("UploadNote")}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  searchWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
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
