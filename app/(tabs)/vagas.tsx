import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { vagasService, VagaDTO } from '../../src/services/vagasService';
import { candidaturasService } from '../../src/services/candidaturasService';
import { useAuth } from '../../src/contexts';
import { usuariosService } from '../../src/services/usuariosService';
import AppButton from '../../src/components/AppButton';

export default function VagasScreen() {
  useProtectedScreen();
  const [loading, setLoading] = useState(true);
  const [vagas, setVagas] = useState<VagaDTO[]>([]);
  const { usuario } = useAuth();
  const [competenciasUsuario, setCompetenciasUsuario] = useState<number[]>([]);
  const [filtroCidade, setFiltroCidade] = useState('');
  const [filtroCompetencias, setFiltroCompetencias] = useState<number[]>([]);

  async function carregarVagas(filters?: { competencias?: number[]; cidade?: string }) {
    setLoading(true);
    try {
      const page = await vagasService.list(0, 50, filters);
      setVagas(page.content);
    } catch (err) {
      console.error('Erro ao carregar vagas', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Buscar competências do usuário para permitir filtro
        if (usuario && Number(usuario.id)) {
          const u = await usuariosService.getById(Number(usuario.id));
          if (mounted && u?.competencias) {
            setCompetenciasUsuario(u.competencias.map((c) => c.id));
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar competências do usuário', err);
      }
      await carregarVagas();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function handleAplicarFiltros() {
    const filters: { competencias?: number[]; cidade?: string } = {};
    if (filtroCompetencias.length > 0) filters.competencias = filtroCompetencias;
    if (filtroCidade.trim()) filters.cidade = filtroCidade.trim();
    carregarVagas(filters);
  }

  function handleLimparFiltros() {
    setFiltroCidade('');
    setFiltroCompetencias([]);
    carregarVagas();
  }

  async function handleCandidatar(vaga: VagaDTO) {
    try {
      const uid = usuario && Number(usuario.id) ? Number(usuario.id) : undefined;
      await candidaturasService.create(vaga.id, uid);
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
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      {/* Filtros */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filtros</Text>
        <View style={styles.filterRow}>
          <TextInput
            style={styles.filterInput}
            placeholder="Filtrar por cidade"
            placeholderTextColor="#9ca3af"
            value={filtroCidade}
            onChangeText={setFiltroCidade}
          />
        </View>
        {competenciasUsuario.length > 0 && (
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Minhas competências:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {competenciasUsuario.map((cId) => {
                const selected = filtroCompetencias.includes(cId);
                return (
                  <TouchableOpacity
                    key={cId}
                    style={[styles.compChip, selected && styles.compChipSelected]}
                    onPress={() => {
                      if (selected) {
                        setFiltroCompetencias(filtroCompetencias.filter((id) => id !== cId));
                      } else {
                        setFiltroCompetencias([...filtroCompetencias, cId]);
                      }
                    }}
                  >
                    <Text style={[styles.compChipText, selected && styles.compChipTextSelected]}>
                      ID {cId}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        <View style={styles.filterActions}>
          <AppButton title="Aplicar filtros" onPress={handleAplicarFiltros} />
          <AppButton title="Limpar" onPress={handleLimparFiltros} />
        </View>
      </View>
      {/* Lista de vagas */}
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
  filterContainer: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 6,
  },
  filterInput: {
    backgroundColor: '#020617',
    borderRadius: 8,
    padding: 10,
    color: '#f9fafb',
    fontSize: 14,
  },
  compChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4b5563',
    marginRight: 8,
    backgroundColor: '#0f172a',
  },
  compChipSelected: {
    borderColor: '#60a5fa',
    backgroundColor: '#1e3a8a',
  },
  compChipText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  compChipTextSelected: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
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
