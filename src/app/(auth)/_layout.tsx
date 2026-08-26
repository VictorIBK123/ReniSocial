import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="complete-profile" />
      <Stack.Screen name="connect-socials" />
      <Stack.Screen 
        name="welcome-success"
        options={{
          animation: 'fade',
          contentStyle: { backgroundColor: '#001E88' },
        }}
      />
    </Stack>
  );
}
