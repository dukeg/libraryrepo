import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  TouchableOpacity, Image
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, CormorantGaramond_400Regular, CormorantGaramond_700Bold, CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond';
import * as SplashScreen from 'expo-splash-screen';

// ── Screens ──
import HomeScreen from './src/screens/HomeScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import AIScreen from './src/screens/AIScreen';
import ShelfScreen from './src/screens/ShelfScreen';
import LibrariesScreen from './src/screens/LibrariesScreen';
import BookReaderScreen from './src/screens/BookReaderScreen';
import AuthScreen from './src/screens/AuthScreen';
import DeepSeekScreen from './src/screens/DeepSeekScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

// ── Context ──
import { AppProvider, useApp } from './src/services/AppContext';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const COLORS = {
  void: '#06060a',
  deep: '#0c0c14',
  surface: '#11111d',
  panel: '#161624',
  border: '#1e1e32',
  gold: '#c9a84c',
  goldDim: '#8a6f2e',
  goldBright: '#f0c96a',
  silver: '#8888aa',
  mist: '#aaaacc',
  snow: '#e8e8f4',
  teal: '#2db8b8',
  purple: '#c080ff',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.deep,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 14,
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.silver,
        tabBarLabelStyle: {
          fontFamily: 'System',
          fontSize: 10,
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'library' : 'library-outline',
            Discover: focused ? 'search' : 'search-outline',
            AI: focused ? 'sparkles' : 'sparkles-outline',
            Shelf: focused ? 'bookmark' : 'bookmark-outline',
            Libraries: focused ? 'globe' : 'globe-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarLabel: 'Discover' }} />
      <Tab.Screen name="AI" component={AIScreen} options={{ tabBarLabel: 'AI Agent' }} />
      <Tab.Screen name="Shelf" component={ShelfScreen} options={{ tabBarLabel: 'My Shelf' }} />
      <Tab.Screen name="Libraries" component={LibrariesScreen} options={{ tabBarLabel: 'Libraries' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user } = useApp();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="BookReader" component={BookReaderScreen} options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen name="DeepSeek" component={DeepSeekScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
    CormorantGaramond_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.void} />
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
