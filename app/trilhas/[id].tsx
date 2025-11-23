import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { trilhasService, CursoDTO, TrilhaDTO } from '../../src/services/trilhasService';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function TrilhaDetailScreen() {
  useProtectedScreen();
  const params = useLocalSearchParams();
  const id = params?.id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [trilha, setTrilha] = useState<TrilhaDTO | null>(null);
  const [cursos, setCursos] = useState<CursoDTO[]>([]);
  const accent = useThemeColor({}, 'accent');
  const background = useThemeColor({}, 'background');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      try {
        const trilhaId = Number(id);
        const cursosData = await trilhasService.cursosByTrilha(trilhaId);
        if (mounted) {
          setCursos(cursosData);
          setTrilha({ id: trilhaId, titulo: `Trilha ${trilhaId}`, descricao: '', cursos: cursosData });
        }
      } catch (err) {
        console.error('Erro ao carregar trilha', err);
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
      <View style={[styles.center, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={accent} />
        <Text style={styles.loading}>Carregando trilha...</Text>
      </View>
    );
  }

  if (!trilha) {
    return (
      <View style={[styles.center, { backgroundColor: background }]}>
        <Text style={styles.empty}>Trilha não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={styles.title}>{trilha.titulo}</Text>
      {!!trilha.descricao && <Text style={styles.description}>{trilha.descricao}</Text>}

      <Text style={styles.sectionTitle}>Cursos desta trilha</Text>
      {cursos.length === 0 ? (
        <Text style={styles.empty}>Nenhum curso cadastrado para esta trilha.</Text>
      ) : (
        <FlatList
          data={cursos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.cursoCard}>
              <Text style={styles.cursoTitle}>{item.titulo}</Text>
              <Text style={styles.cursoMeta}>
                {item.cargaHoraria ? `${item.cargaHoraria}h` : 'Carga horária não informada'} •{' '}
                {item.provedor || 'Provedor não informado'}
              </Text>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: accent }]}>
                <Text style={styles.actionButtonText}>Iniciar curso</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    marginTop: 12,
    color: '#e5e7eb',
  },
  empty: {
    color: '#9ca3af',
    fontSize: 14,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  cursoCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cursoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 4,
  },
  cursoMeta: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 10,
  },
  actionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});