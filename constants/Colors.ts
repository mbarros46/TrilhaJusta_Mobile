/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Paleta TrilhaJusta (identidade simples)
const accent = '#0B7A6B'; // verde principal
const accentAlt = '#F59E0B'; // amarelo-alaranjado para destaques
const textLight = '#0f1720';
const surfaceLight = '#ffffff';

export const Colors = {
  light: {
    text: textLight,
    background: '#FAFBFB',
    tint: accent,
    accent: accent,
    accentAlt: accentAlt,
    icon: '#4b5563',
    tabIconDefault: '#94a3b8',
    tabIconSelected: accent,
    surface: surfaceLight,
    border: '#e6eef0',
    card: '#ffffff',
  },
  dark: {
    text: '#E6EEF0',
    background: '#07111a',
    tint: '#bfece6',
    accent: accent,
    accentAlt: accentAlt,
    icon: '#9aa8b0',
    tabIconDefault: '#6b7280',
    tabIconSelected: accent,
    surface: '#071a1f',
    border: '#12313a',
    card: '#071a1f',
  },
};
