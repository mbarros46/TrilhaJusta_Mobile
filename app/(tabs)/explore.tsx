import { useState } from 'react';
import { StyleSheet, FlatList, TextInput } from 'react-native';

import { ThemedText, ThemedView } from '../../src/components';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '../../hooks/useThemeColor';

// sample data kept for UI demo — patio and city labels will use translations

export default function ExploreScreen() {
  const { t } = useTranslation();
  // build mocked data using translations so strings are i18n-controlled
  const dadosMockados = [
    { id: '1', modelo: 'Honda CG 160', patio: t('explore.patio_A'), localizacao: t('explore.city_sp') },
    { id: '2', modelo: 'Yamaha Fazer 250', patio: t('explore.patio_B'), localizacao: t('explore.city_campinas') },
    { id: '3', modelo: 'Honda Biz 125', patio: t('explore.patio_A'), localizacao: t('explore.city_sp') },
    { id: '4', modelo: 'Yamaha Crosser 150', patio: t('explore.patio_C'), localizacao: t('explore.city_santos') },
  ];
  const [busca, setBusca] = useState('');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const resultados = dadosMockados.filter(
    (item) =>
      item.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      item.localizacao.toLowerCase().includes(busca.toLowerCase()) ||
      item.patio.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('explore.title')}
      </ThemedText>
      <TextInput
        style={[styles.input, { backgroundColor: cardColor, borderColor: borderColor }]}
        placeholder={t('explore.search_placeholder')}
        value={busca}
        onChangeText={setBusca}
        placeholderTextColor={useThemeColor({}, 'icon')}
      />
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={[styles.item, { backgroundColor: cardColor, borderColor: borderColor }]}>
            <ThemedText style={[styles.itemTitle, styles.darkText]}>
              {item.modelo}
            </ThemedText>
            <ThemedText style={[styles.itemText, styles.darkText]}>
              {t('explore.patio')} {item.patio}
            </ThemedText>
            <ThemedText style={[styles.itemText, styles.darkText]}>
              {t('explore.location')} {item.localizacao}
            </ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginBottom: 20, textAlign: 'center' },
  input: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
  },
  item: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemText: { fontSize: 14 },
  darkText: { color: 'black' },
});
