import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';

import { useAuth } from '../store/authStore';
import QueryProvider from '../store/QueryProvider';
import { useUserProfileQuery } from '../hooks/useUserProfile';

// Keep the native splash screen visible until fonts and auth status are loaded
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  const isHydrated = useAuth((state) => state.isHydrated);
  const isReady = (fontsLoaded || fontError) && isHydrated;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) {
    // Return null — the native splash screen stays visible
    return null;
  }

  return (
    <QueryProvider>
      <RootLayoutNav />
    </QueryProvider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // TanStack Query auto-fetches profile when authenticated
  // and persists the cache to AsyncStorage
  useUserProfileQuery();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';
    const currentSubRoute = segments[1] as string | undefined;
    const isPostAuthOnboarding =
      segments[0] === '(auth)' &&
      (currentSubRoute === 'welcome-success' || currentSubRoute === 'connect-socials');
    const inAuthGroup =
      segments[0] === '(auth)' ||
      (segments as string[]).length === 0 ||
      (segments as string[])[0] === 'index';

    if (isAuthenticated) {
      if (!inTabsGroup && !isPostAuthOnboarding) {
        router.replace('/(tabs)/dashboard');
      }
    } else {
      if (!inAuthGroup) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, segments]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
