import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { candidaturasService, CandidaturaDTO } from '../../src/services/candidaturasService';

export default function CandidaturaDetailScreen() {
  useProtectedScreen();
  const params = useLocalSearchParams();
  const id = params?.id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [candidatura, setCandidatura] = useState<CandidaturaDTO | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      try {
        const found = await candidaturasService.getById(Number(id));
        if (mounted) setCandidatura(found as CandidaturaDTO);
      } catch (err) {
        console.error('Erro ao carregar candidatura', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    );
  }

  if (!candidatura) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Candidatura não encontrada.</Text>
      </View>
    );
  }

  const vaga = candidatura.vaga;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{vaga?.titulo}</Text>
      <Text style={styles.company}>{vaga?.empresa}</Text>
      <Text style={styles.location}>
        {vaga?.cidade} / {vaga?.uf}
      </Text>

      <Text style={styles.sectionTitle}>Status</Text>
      <Text style={styles.text}>{candidatura.status}</Text>

      <Text style={styles.sectionTitle}>Descrição da vaga</Text>
      <Text style={styles.text}>{vaga?.descricao || 'Sem descrição detalhada.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
  },
  loading: {
    marginTop: 12,
    color: '#e5e7eb',
  },
  empty: {
    color: '#9ca3af',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
  },
  company: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  location: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginTop: 12,
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: '#cbd5f5',
  },
});
