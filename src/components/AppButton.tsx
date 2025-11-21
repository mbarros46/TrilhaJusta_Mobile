import React from 'react';
import { Pressable, TextStyle, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import Loading from './Loading';

interface Props {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  color?: string;
}

export default function AppButton({ title, onPress, loading, icon, style, textStyle, disabled, variant = 'solid', color = '#0A7EA4' }: Props) {
  const isOutline = variant === 'outline';

  const baseStyle: StyleProp<ViewStyle> = {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const dynamicStyle = isOutline
    ? { backgroundColor: 'transparent', borderWidth: 2, borderColor: color }
    : { backgroundColor: color };

  const textColor = isOutline ? color : 'white';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !!loading}
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
      style={({ pressed }) => [
        baseStyle,
        dynamicStyle,
        style,
        (pressed || disabled || !!loading) && { opacity: 0.8, transform: [{ scale: pressed ? 0.995 : 1 }] },
      ]}
      accessibilityState={{ disabled: !!disabled || !!loading }}
    >
      {loading ? (
        <Loading color={textColor as any} />
      ) : (
        <>
          {icon && <Ionicons name={icon as any} size={18} color={textColor} style={{ marginRight: 8 }} />}
          <ThemedText style={[{ color: textColor, fontSize: 16, fontWeight: '600' }, textStyle]}>{title}</ThemedText>
        </>
      )}
    </Pressable>
  );
}
