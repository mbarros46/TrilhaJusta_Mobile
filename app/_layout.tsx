import 'react-native-reanimated';
import React from 'react';
// re-export typing for expo-router Stack sometimes missing in older type bundles — silence TS here
// @ts-ignore
import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import * as Font from 'expo-font';

import { ThemeProviderCustom, useThemeCustom, AuthProvider, LanguageProvider } from '../src/contexts';
import DevBanner from '../src/components/DevBanner';

// Registrar fontes do app (SpaceMono já presente no assets)
function useLoadFonts() {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Font.loadAsync({
          TrilhaJusta: require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // não crítico
        console.warn('Falha ao carregar fontes', e);
      }
      if (mounted) setLoaded(true);
    })();
    return () => { mounted = false; };
  }, []);

  return loaded;
}

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
        <Stack.Screen name="trilhas/[id]" options={{ title: 'Detalhe da Trilha' }} />
        <Stack.Screen name="ai/recomendacoes" options={{ title: 'Recomendações por IA' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();

  return (
    <ThemeProviderCustom>
      <LanguageProvider>
        <SafeAreaProvider>
          <AuthProvider>
            {!fontsLoaded ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <>
                <DevBanner />
                <RootStack />
              </>
            )}
          </AuthProvider>
        </SafeAreaProvider>
      </LanguageProvider>
    </ThemeProviderCustom>
  );
}
