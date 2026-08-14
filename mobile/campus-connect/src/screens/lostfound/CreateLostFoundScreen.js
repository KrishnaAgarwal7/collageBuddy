import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { lostFoundApi } from "../../api/lostFound";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { colors, radius, spacing } from "../../theme/colors";

const CATEGORIES = ["Electronics", "Books", "ID Card", "Wallet", "Keys", "Clothing", "Accessories", "Others"];
const TYPES = ["Lost", "Found"];

export default function CreateLostFoundScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [type, setType] = useState("Lost");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is needed to attach an image");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        name: asset.fileName || "photo.jpg",
        type: asset.mimeType || "image/jpeg",
      });
    }
  };

  const onSubmit = async () => {
    setError(null);
    if (!title || !description || !location) {
      setError("Please fill in title, description, and location");
      return;
    }
    setSaving(true);
    try {
      await lostFoundApi.create({ title, description, category, type, location, contactNumber }, image);
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={styles.heading}>Report an item</Text>

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeRow}>
          {TYPES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[styles.typeChip, type === t && styles.typeChipActive]}
            >
              <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Black wallet" />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the item, any distinguishing marks, etc."
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.typeRow}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.typeChip, category === c && styles.typeChipActive]}
            >
              <Text style={[styles.typeChipText, category === c && styles.typeChipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Input label="Location" value={location} onChangeText={setLocation} placeholder="Where lost/found" />
        <Input
          label="Contact number (optional)"
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholder="For people to reach you"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Photo (optional)</Text>
        <Pressable style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePickerEmpty}>
              <Ionicons name="camera-outline" size={28} color={colors.textMuted} />
              <Text style={styles.imagePickerText}>Tap to add a photo</Text>
            </View>
          )}
        </Pressable>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Submit report"
          onPress={onSubmit}
          loading={saving}
          style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipText: {
    color: colors.text,
    fontSize: 13,
  },
  typeChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  imagePickerEmpty: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontSize: 13,
  },
  previewImage: {
    width: "100%",
    height: 180,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.sm,
  },
});
