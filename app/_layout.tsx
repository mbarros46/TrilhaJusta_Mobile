import React from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { ThemeProviderCustom, useThemeCustom, AuthProvider } from '../src/contexts';

function RootStack() {
  const { navTheme } = useThemeCustom();

  return (
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="candidaturas/index" options={{ title: 'Minhas Candidaturas' }} />
        <Stack.Screen name="candidaturas/[id]" options={{ title: 'Detalhe da Candidatura' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProviderCustom>
      <SafeAreaProvider>
        <AuthProvider>
          <RootStack />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProviderCustom>
  );
}
