import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAccentColor } from '../../src/styles/theme';
import { useThemeColor } from '../../hooks/useThemeColor';

interface Props {
  size?: number | 'small' | 'large';
  color?: string;
  label?: string;
}

export default function Loading({ size = 'small', color, label }: Props) {
  const { accentColor } = useAccentColor();
  const accent = useThemeColor({}, 'accent');
  const indicatorColor = (color ?? accentColor) || accent || '#0B7A6B';

  return (
    <View style={styles.container} accessibilityRole={"progressbar"} accessibilityLiveRegion={"polite"}>
      <ActivityIndicator size={size} color={indicatorColor} />
      {label ? <Text style={[styles.label, { color: indicatorColor }]}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
