import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ThemedText, ThemedView } from '../src/components';
import { useLanguage } from '../src/contexts';
import { t } from '../src/i18n';
import AppButton from '../src/components/AppButton';

export default function NotFoundScreen() {
  const navigation = useNavigation();
  const { lang } = useLanguage();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{t('notfound_message', lang)}</ThemedText>
      <AppButton
        title={t('go_home', lang)}
        onPress={() => {
          // @ts-ignore - navigation types depend on router setup
          navigation.navigate('(tabs)');
        }}
        style={styles.link}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
