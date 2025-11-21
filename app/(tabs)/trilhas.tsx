import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { trilhasService, TrilhaDTO, CursoDTO } from '../../src/services/trilhasService';

export default function TrilhasScreen() {
  useProtectedScreen();
  const [loading, setLoading] = useState(true);
  const [trilhas, setTrilhas] = useState<TrilhaDTO[]>([]);
  const [cursosPorTrilha, setCursosPorTrilha] = useState<Record<number, CursoDTO[]>>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await trilhasService.listAll();
        if (mounted) setTrilhas(data);
        // Carrega cursos de cada trilha para exibição inline
        for (const t of data) {
          try {
            const cursos = await trilhasService.cursosByTrilha(t.id);
            if (mounted) {
              setCursosPorTrilha((prev) => ({ ...prev, [t.id]: cursos }));
            }
          } catch {
            // ignora erro de uma trilha específica
          }
        }
      } catch (err) {
        console.error('Erro ao carregar trilhas', err);
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text style={styles.loading}>Carregando trilhas...</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={trilhas}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => {
        const cursos = cursosPorTrilha[item.id] || [];
        return (
          <View style={styles.card}>
            <Text style={styles.title}>{item.titulo}</Text>
            {!!item.descricao && <Text style={styles.description}>{item.descricao}</Text>}

            <Text style={styles.sectionTitle}>Cursos</Text>
            {cursos.length === 0 ? (
              <Text style={styles.empty}>Nenhum curso cadastrado para esta trilha.</Text>
            ) : (
              cursos.map((c) => (
                <View key={c.id} style={styles.courseRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.courseTitle}>{c.titulo}</Text>
                    <Text style={styles.courseMeta}>
                      {c.cargaHoraria ? `${c.cargaHoraria}h` : 'Carga horária não informada'} •{' '}
                      {c.provedor || 'Provedor não informado'}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.chip}>
                    <Text style={styles.chipText}>Concluir</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        );
      }}
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
  description: {
    marginTop: 4,
    fontSize: 13,
    color: '#cbd5f5',
  },
  sectionTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  empty: {
    marginTop: 4,
    fontSize: 13,
    color: '#9ca3af',
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  courseTitle: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  courseMeta: {
    fontSize: 12,
    color: '#9ca3af',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  chipText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
});
