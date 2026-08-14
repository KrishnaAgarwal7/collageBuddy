import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { colors, spacing } from "../../theme/colors";

export default function ProfileSetupScreen() {
  const { completeProfile } = useAuth();
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [currentSem, setCurrentSem] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!course || !branch || !currentSem || !rollNumber) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await completeProfile({
        course: course.trim(),
        branch: branch.trim(),
        currentSem: Number(currentSem),
        rollNumber: Number(rollNumber),
      });
      // RootNavigator will switch to the main app automatically once
      // user.profileCompleted becomes true.
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>
          A few more details so we can personalize your experience
        </Text>

        <View style={{ marginTop: spacing.lg }}>
          <Input label="Course" placeholder="B.Tech" value={course} onChangeText={setCourse} />
          <Input label="Branch" placeholder="CSE" value={branch} onChangeText={setBranch} />
          <Input
            label="Current semester"
            placeholder="5"
            keyboardType="number-pad"
            value={currentSem}
            onChangeText={setCurrentSem}
          />
          <Input
            label="Roll number"
            placeholder="2101234"
            keyboardType="number-pad"
            value={rollNumber}
            onChangeText={setRollNumber}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button title="Continue" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.sm }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 4,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.sm,
  },
});
