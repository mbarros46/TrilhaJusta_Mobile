import React from 'react';
import { TouchableOpacity, Platform, Linking, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';

type Props = {
  href: string;
  children?: React.ReactNode;
  style?: any;
  accessibilityLabel?: string;
};

export function ExternalLink({ href, children, style, accessibilityLabel }: Props) {
  const handlePress = async (event?: GestureResponderEvent) => {
    try {
      if (Platform.OS === 'web') {
        // On web, use the native navigation
        window.open(href, '_blank');
        return;
      }

      // On native, try to open using the in-app browser first
      const supported = await Linking.canOpenURL(href);
      if (!supported) {
        await openBrowserAsync(href);
        return;
      }

      // Prefer Linking to let the device handle external apps if available
      await Linking.openURL(href);
    } catch (err) {
      // Last resort: open in in-app browser
      try {
        await openBrowserAsync(href);
      } catch (e) {
        console.warn('[ExternalLink] failed to open url', href, e);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style} accessibilityLabel={accessibilityLabel}>
      {children ?? <Text style={styles.link}>{href}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#1B95E0',
    textDecorationLine: 'underline',
  },
});
