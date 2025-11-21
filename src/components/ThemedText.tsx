import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '../../hooks/useThemeColor';
import { useLanguage } from '../contexts';
import { t } from '../i18n';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption' | 'heading';
  i18nKey?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  i18nKey,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  let translatedProps: Partial<typeof rest> = {} as any;
  try {
    const { lang } = useLanguage();
    if (i18nKey) {
      // override children with the translated string
      // @ts-ignore
      translatedProps.children = t(i18nKey, lang);
    }
  } catch (e) {
    // if useLanguage isn't available yet, fallback to static t
    if (i18nKey) {
      // @ts-ignore
      translatedProps.children = t(i18nKey);
    }
  }

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'heading' ? styles.heading : undefined,
        style,
      ]}
      {...rest}
      {...translatedProps}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    opacity: 0.7,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontWeight: '500',
  },
});
