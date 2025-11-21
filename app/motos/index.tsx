import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView, ThemedText } from '../../src/components';
import { useTranslation } from 'react-i18next';
import { motosHttpService, MotoDTO } from '../../src/services/motosHttpService';
import { useRouter } from 'expo-router';
import AppButton from '../../src/components/AppButton';

export default function MotosListScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [motos, setMotos] = useState<MotoDTO[]>([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await motosHttpService.list();
        if (mounted) setMotos(data);
      } catch (err) {
        console.warn(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
        <ThemedText style={{ marginTop: 12 }}>{t('loading_label')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <AppButton title={t('buttons.create_moto')} onPress={() => router.push('/motos/new')} />
      <FlatList
        data={motos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => router.push(`/motos/${item.id}`)}>
            <ThemedText style={styles.itemTitle}>{item.modelo}</ThemedText>
            <ThemedText style={styles.itemSubtitle}>{item.placa}</ThemedText>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => <ThemedText>{t('motos.empty_list')}</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: 16 },
  item: { padding: 16, borderRadius: 10, backgroundColor: 'white', marginBottom: 12 },
  itemTitle: { fontSize: 16, fontWeight: '700' },
  itemSubtitle: { fontSize: 14, color: '#666' },
});
