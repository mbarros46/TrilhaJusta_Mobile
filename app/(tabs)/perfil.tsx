import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { usuariosService, UsuarioDTO } from '../../src/services/usuariosService';
import { competenciasService } from '../../src/services/competenciasService';

const DEFAULT_USER_ID = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DEFAULT_USER_ID)
  ? parseInt(process.env.EXPO_PUBLIC_DEFAULT_USER_ID, 10)
  : 1;

export default function PerfilScreen() {
  useProtectedScreen();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [todasCompetencias, setTodasCompetencias] = useState<any[]>([]);

  async function carregar() {
    setLoading(true);
    try {
      const [u, comps] = await Promise.all([
        usuariosService.getById(DEFAULT_USER_ID),
        competenciasService.listAll(),
      ]);
      setUsuario(u);
      setTodasCompetencias(comps);
    } catch (err) {
      console.error('Erro ao carregar perfil', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleToggleCompetencia(compId: number) {
    if (!usuario) return;
    try {
      const has = usuario.competencias?.some((c) => c.id === compId);
      let updated: UsuarioDTO;
      if (has) {
        updated = await usuariosService.removeCompetencia(usuario.id, compId);
      } else {
        updated = await usuariosService.addCompetencia(usuario.id, compId);
      }
      setUsuario(updated);
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Não foi possível atualizar competências.');
    }
  }

  if (loading || !usuario) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text style={styles.loading}>Carregando perfil...</Text>
      </View>
    );
  }

  const competenciasUsuario = usuario.competencias ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{usuario.nome}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
        <Text style={styles.location}>
          {usuario.cidade} / {usuario.uf}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Minhas competências</Text>
      {competenciasUsuario.length === 0 ? (
        <Text style={styles.empty}>Você ainda não possui competências associadas.</Text>
      ) : (
        <View style={styles.chipsRow}>
          {competenciasUsuario.map((c) => (
            <View key={c.id} style={styles.chipActive}>
              <Text style={styles.chipText}>{c.nome}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Adicionar/Remover competências</Text>
      <FlatList
        data={todasCompetencias}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const selected = competenciasUsuario.some((c) => c.id === item.id);
          return (
            <TouchableOpacity
              style={[styles.compRow, selected && styles.compRowSelected]}
              onPress={() => handleToggleCompetencia(item.id)}
            >
              <Text style={styles.compName}>{item.nome}</Text>
              <Text style={styles.compArea}>{item.area || 'Área geral'}</Text>
              <Text style={styles.compAction}>{selected ? 'Remover' : 'Adicionar'}</Text>
            </TouchableOpacity>
          );
        }}
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#020617',
  },
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
  },
  email: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  location: {
    fontSize: 13,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  empty: {
    fontSize: 13,
    color: '#9ca3af',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipActive: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#4f46e5',
  },
  chipText: {
    fontSize: 12,
    color: '#eef2ff',
    fontWeight: '600',
  },
  compRow: {
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 6,
    backgroundColor: '#020617',
  },
  compRowSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#020617',
  },
  compName: {
    fontSize: 14,
    color: '#f9fafb',
  },
  compArea: {
    fontSize: 12,
    color: '#9ca3af',
  },
  compAction: {
    fontSize: 12,
    color: '#60a5fa',
    marginTop: 4,
  },
});
