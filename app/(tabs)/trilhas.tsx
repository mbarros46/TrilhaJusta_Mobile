import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { trilhasService, TrilhaDTO, CursoDTO } from '../../src/services/trilhasService';

export default function TrilhasScreen() {
  useProtectedScreen();
  const router = useRouter();
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

  if (trilhas.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Nenhuma trilha disponível no momento.</Text>
        <Text style={styles.emptySubtitle}>Verifique se o backend está rodando.</Text>
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
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/trilhas/${item.id}`)}
            activeOpacity={0.7}
          >
            <Text style={styles.title}>{item.titulo}</Text>
            {!!item.descricao && <Text style={styles.description}>{item.descricao}</Text>}

            <Text style={styles.sectionTitle}>{cursos.length} curso(s)</Text>
            {cursos.length > 0 && (
              <View style={styles.cursosPreview}>
                {cursos.slice(0, 3).map((c) => (
                  <Text key={c.id} style={styles.cursoPreviewText}>
                    • {c.titulo}
                  </Text>
                ))}
                {cursos.length > 3 && (
                  <Text style={styles.cursoPreviewText}>+ {cursos.length - 3} outros</Text>
                )}
              </View>
            )}
            <Text style={styles.verMais}>Toque para ver detalhes →</Text>
          </TouchableOpacity>
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
    fontSize: 14,
    color: '#f9fafb',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  cursosPreview: {
    marginTop: 8,
  },
  cursoPreviewText: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  verMais: {
    fontSize: 13,
    color: '#60a5fa',
    marginTop: 12,
    fontWeight: '600',
  },
});
