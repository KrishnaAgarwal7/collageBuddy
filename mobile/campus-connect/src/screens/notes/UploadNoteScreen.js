import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { notesApi } from "../../api/notes";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { colors, radius, spacing } from "../../theme/colors";

export default function UploadNoteScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [resourceType, setResourceType] = useState("file"); // 'file' | 'link'
  const [externalLink, setExternalLink] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ],
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType });
    }
  };

  const onSubmit = async () => {
    setError(null);
    if (!title || !courseId || !semester) {
      setError("Please fill in title, course, and semester");
      return;
    }
    if (resourceType === "file" && !file) {
      setError("Please choose a file to upload");
      return;
    }
    if (resourceType === "link" && !externalLink) {
      setError("Please provide a link");
      return;
    }
    setSaving(true);
    try {
      await notesApi.create(
        {
          title,
          description,
          courseId,
          semester,
          resourceType,
          externalLink: resourceType === "link" ? externalLink : undefined,
        },
        resourceType === "file" ? file : null
      );
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
        <Text style={styles.heading}>Share a resource</Text>

        <View style={styles.typeRow}>
          {["file", "link"].map((t) => (
            <Pressable
              key={t}
              onPress={() => setResourceType(t)}
              style={[styles.typeChip, resourceType === t && styles.typeChipActive]}
            >
              <Text style={[styles.typeChipText, resourceType === t && styles.typeChipTextActive]}>
                {t === "file" ? "Upload a file" : "Share a link"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Mid-sem notes: Data Structures" />
        <Input
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="What's covered here?"
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: "top" }}
        />
        <Input label="Course ID" value={courseId} onChangeText={setCourseId} placeholder="CS201" />
        <Input
          label="Semester"
          value={semester}
          onChangeText={setSemester}
          placeholder="3"
          keyboardType="number-pad"
        />

        {resourceType === "file" ? (
          <>
            <Text style={styles.label}>File</Text>
            <Pressable style={styles.filePicker} onPress={pickFile}>
              <Ionicons name="cloud-upload-outline" size={22} color={colors.primary} />
              <Text style={styles.filePickerText}>{file ? file.name : "Choose a PDF, DOC, or PPT"}</Text>
            </Pressable>
          </>
        ) : (
          <Input
            label="Link"
            value={externalLink}
            onChangeText={setExternalLink}
            placeholder="https://..."
            autoCapitalize="none"
          />
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Share resource"
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
    marginBottom: spacing.md,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  typeChipTextActive: {
    color: "#fff",
  },
  filePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: 8,
  },
  filePickerText: {
    color: colors.text,
    marginLeft: 8,
    flexShrink: 1,
    fontSize: 13,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.sm,
  },
});
