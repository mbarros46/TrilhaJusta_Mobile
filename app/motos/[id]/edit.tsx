import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView, ThemedText } from '../../../src/components';
import AppButton from '../../../src/components/AppButton';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function EditMotoScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 12 }}>{t('removed_feature_title', 'Tela removida')}</ThemedText>
      <ThemedText>{t('removed_feature_message', 'Este recurso relacionado a motos foi removido do aplicativo.')}</ThemedText>
      <View style={{ height: 16 }} />
      <AppButton title={t('buttons.back', 'Voltar')} onPress={() => router.back()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
