import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";
import ProfileSetupScreen from "../screens/auth/ProfileSetupScreen";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RootNavigator() {
  const { booting, isAuthenticated, user } = useAuth();

  if (booting) return <LoadingSpinner />;

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : !user?.profileCompleted ? (
        <ProfileSetupScreen />
      ) : (
        <AppTabs />
      )}
    </NavigationContainer>
  );
}
