import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function TabBarBackground() {
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight ? useBottomTabBarHeight() : 64;
  const background = useThemeColor({}, 'card');

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: background, height: tabHeight + insets.bottom },
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight ? useBottomTabBarHeight() : 64;
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
