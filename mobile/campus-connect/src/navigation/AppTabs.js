import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

import HomeScreen from "../screens/home/HomeScreen";
import EventsScreen from "../screens/events/EventsScreen";
import EventDetailScreen from "../screens/events/EventDetailScreen";
import EventFormScreen from "../screens/events/EventFormScreen";
import LostFoundScreen from "../screens/lostfound/LostFoundScreen";
import LostFoundDetailScreen from "../screens/lostfound/LostFoundDetailScreen";
import CreateLostFoundScreen from "../screens/lostfound/CreateLostFoundScreen";
import MyPostsScreen from "../screens/lostfound/MyPostsScreen";
import NotesScreen from "../screens/notes/NotesScreen";
import NoteDetailScreen from "../screens/notes/NoteDetailScreen";
import UploadNoteScreen from "../screens/notes/UploadNoteScreen";
import AdminUsersScreen from "../screens/admin/AdminUsersScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();
const HomeStackNav = createNativeStackNavigator();
const EventsStackNav = createNativeStackNavigator();
const LostFoundStackNav = createNativeStackNavigator();
const NotesStackNav = createNativeStackNavigator();
const AdminStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTitleStyle: { color: colors.text, fontWeight: "700" },
  headerTintColor: colors.primary,
};

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={headerOptions}>
      <HomeStackNav.Screen name="HomeMain" component={HomeScreen} options={{ title: "Campus Connect" }} />
      {/* Quick-link destinations reuse the same screens as their dedicated tabs */}
      <HomeStackNav.Screen name="Events" component={EventsScreen} options={{ title: "Events" }} />
      <HomeStackNav.Screen name="EventDetail" component={EventDetailScreen} options={{ title: "Event" }} />
      <HomeStackNav.Screen name="EventForm" component={EventFormScreen} options={{ title: "Event" }} />
      <HomeStackNav.Screen name="LostFound" component={LostFoundScreen} options={{ title: "Lost & Found" }} />
      <HomeStackNav.Screen
        name="LostFoundDetail"
        component={LostFoundDetailScreen}
        options={{ title: "Report" }}
      />
      <HomeStackNav.Screen
        name="CreateLostFound"
        component={CreateLostFoundScreen}
        options={{ title: "Report an item" }}
      />
      <HomeStackNav.Screen name="MyPosts" component={MyPostsScreen} options={{ title: "My posts" }} />
      <HomeStackNav.Screen name="Notes" component={NotesScreen} options={{ title: "Notes & Resources" }} />
      <HomeStackNav.Screen name="NoteDetail" component={NoteDetailScreen} options={{ title: "Resource" }} />
      <HomeStackNav.Screen name="UploadNote" component={UploadNoteScreen} options={{ title: "Share a resource" }} />
      <HomeStackNav.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </HomeStackNav.Navigator>
  );
}

function EventsStack() {
  return (
    <EventsStackNav.Navigator screenOptions={headerOptions}>
      <EventsStackNav.Screen name="EventsMain" component={EventsScreen} options={{ title: "Events" }} />
      <EventsStackNav.Screen name="EventDetail" component={EventDetailScreen} options={{ title: "Event" }} />
      <EventsStackNav.Screen name="EventForm" component={EventFormScreen} options={{ title: "Event" }} />
    </EventsStackNav.Navigator>
  );
}

function LostFoundStack() {
  return (
    <LostFoundStackNav.Navigator screenOptions={headerOptions}>
      <LostFoundStackNav.Screen
        name="LostFoundMain"
        component={LostFoundScreen}
        options={{ title: "Lost & Found" }}
      />
      <LostFoundStackNav.Screen
        name="LostFoundDetail"
        component={LostFoundDetailScreen}
        options={{ title: "Report" }}
      />
      <LostFoundStackNav.Screen
        name="CreateLostFound"
        component={CreateLostFoundScreen}
        options={{ title: "Report an item" }}
      />
      <LostFoundStackNav.Screen name="MyPosts" component={MyPostsScreen} options={{ title: "My posts" }} />
    </LostFoundStackNav.Navigator>
  );
}

function NotesStack() {
  return (
    <NotesStackNav.Navigator screenOptions={headerOptions}>
      <NotesStackNav.Screen name="NotesMain" component={NotesScreen} options={{ title: "Notes & Resources" }} />
      <NotesStackNav.Screen name="NoteDetail" component={NoteDetailScreen} options={{ title: "Resource" }} />
      <NotesStackNav.Screen name="UploadNote" component={UploadNoteScreen} options={{ title: "Share a resource" }} />
    </NotesStackNav.Navigator>
  );
}

function AdminStack() {
  return (
    <AdminStackNav.Navigator screenOptions={headerOptions}>
      <AdminStackNav.Screen name="AdminMain" component={AdminUsersScreen} options={{ title: "Manage users" }} />
    </AdminStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={headerOptions}>
      <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} options={{ title: "Profile" }} />
    </ProfileStackNav.Navigator>
  );
}

const ICONS = {
  Home: "home",
  Events: "calendar",
  LostFound: "search",
  Notes: "document-text",
  Admin: "shield-checkmark",
  Profile: "person",
};

export default function AppTabs() {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={`${ICONS[route.name]}${focused ? "" : "-outline"}`} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Events" component={EventsStack} />
      <Tab.Screen name="LostFound" component={LostFoundStack} options={{ title: "Lost & Found" }} />
      <Tab.Screen name="Notes" component={NotesStack} />
      {isAdmin ? <Tab.Screen name="Admin" component={AdminStack} /> : null}
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
