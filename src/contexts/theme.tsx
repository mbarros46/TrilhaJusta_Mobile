import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  Theme as NavTheme,
} from '@react-navigation/native';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Mode = 'light' | 'dark' | 'system';
type Ctx = { 
  mode: Mode; 
  setMode(m: Mode): void; 
  navTheme: NavTheme;
  effectiveTheme: 'light' | 'dark';
};

const ThemeContext = createContext<Ctx>({} as any);

export function ThemeProviderCustom({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>('system');
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('@theme-mode');
      if (saved) setMode(saved as Mode);
    })();
  }, []);

  const setModePersist = async (m: Mode) => {
    setMode(m);
    await AsyncStorage.setItem('@theme-mode', m);
  };

  // Determina o tema baseado na configuração e sistema
  const getEffectiveTheme = () => {
    if (mode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return mode;
  };

  const effectiveTheme = getEffectiveTheme();
  
  // Customiza o tema escuro para ficar mais escuro
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#000000',
      card: '#111111',
      text: '#FFFFFF',
      border: '#333333',
      primary: '#FF6B35',
    },
  };
  
  const navTheme = effectiveTheme === 'dark' ? customDarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ mode, setMode: setModePersist, navTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useThemeCustom = () => useContext(ThemeContext);
