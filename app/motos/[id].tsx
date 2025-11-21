import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, Alert, View } from 'react-native';
import { ThemedView, ThemedText } from '../../src/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { motosHttpService } from '../../src/services/motosHttpService';
import { useTranslation } from 'react-i18next';
import AppButton from '../../src/components/AppButton';

export default function MotoDetailScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [moto, setMoto] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
        const data = await motosHttpService.get(Number(id));
        if (mounted) setMoto(data);
      } catch (err) {
        console.warn(err);
        Alert.alert(t('error_label'), t('fetch_fail'));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    try {
      await motosHttpService.remove(Number(id));
      Alert.alert(t('success_label'), t('delete_success'));
      router.back();
    } catch (err) {
      console.warn(err);
      Alert.alert(t('error_label'), t('delete_fail'));
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!moto) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>{t('not_found_message')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{moto.modelo}</ThemedText>
      <View style={{ height: 12 }} />
      <ThemedText>{t('label_plate')}: {moto.placa}</ThemedText>
      <ThemedText>{t('label_patio')}: {moto.patio}</ThemedText>
      <ThemedText>{t('label_km')}: {moto.km}</ThemedText>
  <View style={{ height: 20 }} />
  <AppButton title={t('buttons.edit')} onPress={() => router.push(`/motos/${id}/edit`)} style={{ marginBottom: 8 }} />
  <AppButton title={t('buttons.delete')} onPress={handleDelete} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: 16 },
});
