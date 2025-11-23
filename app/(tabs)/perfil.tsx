import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { usuariosService, UsuarioDTO } from '../../src/services/usuariosService';
import { competenciasService } from '../../src/services/competenciasService';
import { useAuth } from '../../src/contexts';
import AppButton from '../../src/components/AppButton';
import { ThemedText } from '../../src/components/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';

const DEFAULT_USER_ID = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DEFAULT_USER_ID)
  ? parseInt(process.env.EXPO_PUBLIC_DEFAULT_USER_ID, 10)
  : 1;

export default function PerfilScreen() {
  useProtectedScreen();
  const { usuario: authUsuario, token, logout } = useAuth();
  const bg = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'accent');
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [todasCompetencias, setTodasCompetencias] = useState<any[]>([]);

  async function carregar() {
    setLoading(true);
    try {
      // Se tivermos um usuário do contexto e o token for dev, usamos os dados do contexto
      let u: UsuarioDTO | null = null;
      if (token && token.startsWith && token.startsWith('dev-token-') && authUsuario) {
        u = {
          id: Number(authUsuario.id) || DEFAULT_USER_ID,
          nome: authUsuario.nome,
          email: authUsuario.email,
          cidade: '',
          uf: '',
          competencias: [],
        } as UsuarioDTO;
      } else {
        // Tentar buscar usuário real pelo id do contexto; se não der, usar DEFAULT_USER_ID
        const idToFetch = authUsuario && Number(authUsuario.id) ? Number(authUsuario.id) : DEFAULT_USER_ID;
        try {
          u = await usuariosService.getById(idToFetch);
        } catch (err) {
          console.warn('Falha ao buscar usuário por id, usando default:', err);
          u = null;
        }
      }

      const comps = await competenciasService.listAll();
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
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={accent} />
        <ThemedText style={styles.loading}>Carregando perfil...</ThemedText>
      </View>
    );
  }

  const competenciasUsuario = usuario.competencias ?? [];

  return (
    <View style={[styles.container, { backgroundColor: bg }] }>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
        <AppButton title="Sair" onPress={async () => { await logout(); }} />
      </View>
      <View style={styles.header}>
        <ThemedText type="heading" style={styles.name}>{usuario?.nome ?? authUsuario?.nome ?? 'Usuário'}</ThemedText>
        <ThemedText style={styles.email}>{usuario?.email ?? authUsuario?.email ?? ''}</ThemedText>
        <ThemedText style={styles.location}>
          {usuario?.cidade ?? ''} {usuario?.uf ? ` / ${usuario.uf}` : ''}
        </ThemedText>
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>Minhas competências</ThemedText>
      {competenciasUsuario.length === 0 ? (
        <ThemedText style={styles.empty}>Você ainda não possui competências associadas.</ThemedText>
      ) : (
        <View style={styles.chipsRow}>
          {competenciasUsuario.map((c) => (
            <View key={c.id} style={[styles.chipActive, { backgroundColor: accent }]}>
              <ThemedText style={styles.chipText}>{c.nome}</ThemedText>
            </View>
          ))}
        </View>
      )}

  <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 16 }]}>Adicionar/Remover competências</ThemedText>
      <FlatList
        data={todasCompetencias}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const selected = competenciasUsuario.some((c) => c.id === item.id);
          return (
            <TouchableOpacity
              style={[styles.compRow, selected && { borderColor: accent }]}
              onPress={() => handleToggleCompetencia(item.id)}
            >
              <ThemedText style={styles.compName}>{item.nome}</ThemedText>
              <ThemedText style={styles.compArea}>{item.area || 'Área geral'}</ThemedText>
              <ThemedText style={[styles.compAction, { color: accent }]}>{selected ? 'Remover' : 'Adicionar'}</ThemedText>
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
  },
  loading: {
    marginTop: 12,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
  },
  location: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  empty: {
    fontSize: 13,
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
  },
  compArea: {
    fontSize: 12,
  },
  compAction: {
    fontSize: 12,
    marginTop: 4,
  },
});
