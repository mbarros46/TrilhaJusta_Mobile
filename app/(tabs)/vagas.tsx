import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { vagasService, VagaDTO } from '../../src/services/vagasService';
import { candidaturasService } from '../../src/services/candidaturasService';

export default function VagasScreen() {
  useProtectedScreen();
  const [loading, setLoading] = useState(true);
  const [vagas, setVagas] = useState<VagaDTO[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const page = await vagasService.list(0, 50);
        if (mounted) setVagas(page.content);
      } catch (err) {
        console.error('Erro ao carregar vagas', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleCandidatar(vaga: VagaDTO) {
    try {
      await candidaturasService.create(vaga.id);
      Alert.alert('Candidatura enviada', `Você se candidatou à vaga "${vaga.titulo}".`);
    } catch (err: any) {
      Alert.alert('Erro ao candidatar', err?.message || 'Tente novamente.');
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text style={styles.loading}>Carregando vagas...</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={vagas}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.company}>{item.empresa}</Text>
          <Text style={styles.location}>
            {item.cidade} / {item.uf}
          </Text>
          {!!item.descricao && <Text style={styles.description}>{item.descricao}</Text>}

          <TouchableOpacity style={styles.button} onPress={() => handleCandidatar(item)}>
            <Text style={styles.buttonText}>Candidatar-se</Text>
          </TouchableOpacity>
        </View>
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
  location: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#cbd5f5',
    marginBottom: 10,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  buttonText: {
    color: '#022c22',
    fontWeight: '600',
    fontSize: 13,
  },
});
