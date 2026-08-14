import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import { eventsApi } from "../../api/events";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { colors, radius, spacing } from "../../theme/colors";

const TYPES = ["hackathon", "workshop", "competition", "seminar", "other"];

function DateField({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.dateInput} onPress={() => setShow(true)}>
        <Text style={{ color: value ? colors.text : colors.textMuted }}>
          {value ? new Date(value).toLocaleDateString() : "Select a date"}
        </Text>
      </Pressable>
      {show ? (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, selected) => {
            setShow(Platform.OS === "ios");
            if (selected) onChange(selected.toISOString());
          }}
        />
      ) : null}
    </View>
  );
}

export default function EventFormScreen({ route, navigation }) {
  const existing = route.params?.event;
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [organizer, setOrganizer] = useState(existing?.organizer || "");
  const [eventDate, setEventDate] = useState(existing?.eventDate || "");
  const [registrationDeadline, setRegistrationDeadline] = useState(existing?.registrationDeadline || "");
  const [location, setLocation] = useState(existing?.location || "");
  const [registrationUrl, setRegistrationUrl] = useState(existing?.registrationUrl || "");
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl || "");
  const [type, setType] = useState(existing?.type || "other");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!title || !eventDate) {
      setError("Title and event date are required");
      return;
    }
    const payload = {
      title,
      description,
      organizer,
      eventDate,
      registrationDeadline,
      location,
      registrationUrl,
      imageUrl,
      type,
    };
    setSaving(true);
    try {
      if (isEdit) {
        await eventsApi.update(existing._id, payload);
      } else {
        await eventsApi.create(payload);
      }
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
        <Text style={styles.heading}>{isEdit ? "Edit event" : "New event"}</Text>

        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Hackfest 2026" />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What's this event about?"
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />
        <Input label="Organizer" value={organizer} onChangeText={setOrganizer} placeholder="Club / Dept name" />

        <DateField label="Event date" value={eventDate} onChange={setEventDate} />
        <DateField
          label="Registration deadline (optional)"
          value={registrationDeadline}
          onChange={setRegistrationDeadline}
        />

        <Input label="Location" value={location} onChangeText={setLocation} placeholder="Main auditorium" />
        <Input
          label="Registration URL (optional)"
          value={registrationUrl}
          onChangeText={setRegistrationUrl}
          placeholder="https://..."
          autoCapitalize="none"
        />
        <Input
          label="Image URL (optional)"
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://..."
          autoCapitalize="none"
        />

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

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title={isEdit ? "Save changes" : "Create event"}
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
  dateInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
    textTransform: "capitalize",
  },
  typeChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.sm,
  },
});
