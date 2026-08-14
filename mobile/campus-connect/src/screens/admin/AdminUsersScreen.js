import React, { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { adminApi } from "../../api/admin";
import Card from "../../components/Card";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import { colors, radius, spacing } from "../../theme/colors";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await adminApi.listUsers();
      setUsers(data);
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

  const toggleBlock = async (user) => {
    const action = user.isBlocked ? "unblock" : "block";
    Alert.alert(
      `${action === "block" ? "Block" : "Unblock"} user`,
      `Are you sure you want to ${action} ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action === "block" ? "Block" : "Unblock",
          style: action === "block" ? "destructive" : "default",
          onPress: async () => {
            setBusyId(user._id);
            try {
              if (action === "block") {
                await adminApi.blockUser(user._id);
              } else {
                await adminApi.unblockUser(user._id);
              }
              await load();
            } catch (e) {
              Alert.alert("Error", e.message);
            } finally {
              setBusyId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <FlatList
      style={styles.screen}
      data={users}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={
        error ? (
          <EmptyState icon="alert-circle-outline" title="Couldn't load users" subtitle={error} />
        ) : (
          <EmptyState icon="people-outline" title="No users found" />
        )
      }
      renderItem={({ item }) => (
        <Card style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <View style={styles.tagRow}>
              <View style={[styles.tag, item.role === "admin" && styles.tagAdmin]}>
                <Text style={[styles.tagText, item.role === "admin" && styles.tagTextAdmin]}>{item.role}</Text>
              </View>
              {item.isBlocked ? (
                <View style={[styles.tag, styles.tagBlocked]}>
                  <Text style={[styles.tagText, styles.tagTextBlocked]}>Blocked</Text>
                </View>
              ) : null}
            </View>
          </View>
          <Button
            title={item.isBlocked ? "Unblock" : "Block"}
            variant={item.isBlocked ? "outline" : "danger"}
            loading={busyId === item._id}
            onPress={() => toggleBlock(item)}
            style={styles.actionButton}
          />
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: { fontSize: 15, fontWeight: "700", color: colors.text },
  email: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  tagRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    marginRight: 6,
  },
  tagAdmin: { backgroundColor: "#EEF2FF" },
  tagBlocked: { backgroundColor: "#FEE2E2" },
  tagText: { fontSize: 11, color: colors.textMuted, fontWeight: "600", textTransform: "capitalize" },
  tagTextAdmin: { color: colors.primary },
  tagTextBlocked: { color: colors.danger },
  actionButton: {
    paddingHorizontal: spacing.md,
    minWidth: 90,
  },
});
