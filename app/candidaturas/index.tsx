import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { candidaturasService, CandidaturaDTO, CandidaturaStatus } from '../../src/services/candidaturasService';
import { useRouter } from 'expo-router';

export default function CandidaturasListScreen() {
  useProtectedScreen();
  const [loading, setLoading] = useState(true);
  const [candidaturas, setCandidaturas] = useState<CandidaturaDTO[]>([]);
  const router = useRouter();

  async function carregar() {
    setLoading(true);
    try {
      const page = await candidaturasService.list(0, 50);
      setCandidaturas(page.content);
    } catch (err) {
      console.error('Erro ao carregar candidaturas', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleAtualizarStatus(id: number, status: CandidaturaStatus) {
    try {
      await candidaturasService.updateStatus(id, status);
      Alert.alert('Status atualizado', 'A candidatura foi atualizada.');
      carregar();
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Não foi possível atualizar o status.');
    }
  }

  async function handleCancelar(id: number) {
    Alert.alert('Cancelar candidatura', 'Deseja realmente cancelar esta candidatura?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          try {
            await candidaturasService.remove(id);
            carregar();
          } catch (err: any) {
            Alert.alert('Erro', err?.message || 'Não foi possível cancelar.');
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text style={styles.loading}>Carregando candidaturas...</Text>
      </View>
    );
  }

  if (candidaturas.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Você ainda não possui candidaturas.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={candidaturas}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/candidaturas/${item.id}`)}
        >
          <Text style={styles.title}>{item.vaga?.titulo}</Text>
          <Text style={styles.company}>{item.vaga?.empresa}</Text>
          <Text style={styles.status}>Status: {item.status}</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionChip, { borderColor: '#22c55e' }]}
              onPress={() => handleAtualizarStatus(item.id, 'APROVADA')}
            >
              <Text style={[styles.actionText, { color: '#22c55e' }]}>Aprovar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionChip, { borderColor: '#f97316' }]}
              onPress={() => handleAtualizarStatus(item.id, 'EM_ANALISE')}
            >
              <Text style={[styles.actionText, { color: '#f97316' }]}>Em análise</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionChip, { borderColor: '#f97373' }]}
              onPress={() => handleCancelar(item.id)}
            >
              <Text style={[styles.actionText, { color: '#f97373' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    />
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
  listContainer: {
    padding: 16,
    backgroundColor: '#020617',
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
  },
  company: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  status: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  actionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
