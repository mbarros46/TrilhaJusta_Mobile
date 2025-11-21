import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const COR_DESTAQUE_KEY = '@fleetzone_cor_destaque';
const DEFAULT_ACCENT_COLOR = '#FF6B35'; // Laranja vibrante para motos

export const useAccentColor = () => {
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);

  useEffect(() => {
    loadAccentColor();
  }, []);

  const loadAccentColor = async () => {
    try {
      const savedColor = await AsyncStorage.getItem(COR_DESTAQUE_KEY);
      if (savedColor) {
        setAccentColor(savedColor);
      }
    } catch (error) {
      console.log('Erro ao carregar cor de destaque:', error);
    }
  };

  const saveAccentColor = async (color: string) => {
    try {
      await AsyncStorage.setItem(COR_DESTAQUE_KEY, color);
      setAccentColor(color);
    } catch (error) {
      console.log('Erro ao salvar cor de destaque:', error);
    }
  };

  return { accentColor, saveAccentColor };
};

export const getThemeWithAccent = (accentColor: string) => ({
  colors: {
    primary: accentColor,
    accent: accentColor,
    button: accentColor,
    link: accentColor,
  },
});
