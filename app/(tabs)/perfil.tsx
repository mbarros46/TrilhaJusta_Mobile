import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { usuariosService, UsuarioDTO } from '../../src/services/usuariosService';
import { competenciasService } from '../../src/services/competenciasService';
import { useAuth } from '../../src/contexts';
import AppButton from '../../src/components/AppButton';
import { ThemedText } from '../../src/components/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';

const DEFAULT_USER_ID = (typeof process !== 'undefined' && process.env?.['EXPO_PUBLIC_DEFAULT_USER_ID'])
  ? parseInt(process.env['EXPO_PUBLIC_DEFAULT_USER_ID']!, 10)
  : 1;

export default function PerfilScreen() {
  useProtectedScreen();
  const { usuario: authUsuario, token, logout } = useAuth();
  const bg = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'accent');
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [todasCompetencias, setTodasCompetencias] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [editCidade, setEditCidade] = useState('');
  const [editUf, setEditUf] = useState('');

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
      if (u) {
        setEditNome(u.nome);
        setEditCidade(u.cidade || '');
        setEditUf(u.uf || '');
      }
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

  async function handleSalvarPerfil() {
    if (!usuario) return;
    if (!editNome.trim()) {
      Alert.alert('Atenção', 'O nome não pode ficar vazio.');
      return;
    }
    try {
      const updated = await usuariosService.update(usuario.id, {
        nome: editNome,
        cidade: editCidade,
        uf: editUf,
      });
      setUsuario(updated);
      setEditMode(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Não foi possível atualizar o perfil.');
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
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <AppButton
          title={editMode ? 'Cancelar' : 'Editar perfil'}
          onPress={() => {
            if (editMode) {
              setEditMode(false);
              if (usuario) {
                setEditNome(usuario.nome);
                setEditCidade(usuario.cidade || '');
                setEditUf(usuario.uf || '');
              }
            } else {
              setEditMode(true);
            }
          }}
        />
        {editMode && <AppButton title="Salvar" onPress={handleSalvarPerfil} />}
        {!editMode && <AppButton title="Sair" onPress={async () => { await logout(); }} />}
      </View>
      <View style={styles.header}>
        {!editMode ? (
          <>
            <ThemedText type="heading" style={styles.name}>{usuario?.nome ?? authUsuario?.nome ?? 'Usuário'}</ThemedText>
            <ThemedText style={styles.email}>{usuario?.email ?? authUsuario?.email ?? ''}</ThemedText>
            <ThemedText style={styles.location}>
              {usuario?.cidade ?? ''} {usuario?.uf ? ` / ${usuario.uf}` : ''}
            </ThemedText>
          </>
        ) : (
          <>
            <ThemedText style={styles.label}>Nome</ThemedText>
            <TextInput
              style={styles.input}
              value={editNome}
              onChangeText={setEditNome}
              placeholder="Nome completo"
              placeholderTextColor="#9ca3af"
            />
            <ThemedText style={styles.email}>{usuario?.email ?? authUsuario?.email ?? ''}</ThemedText>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <View style={{ flex: 2 }}>
                <ThemedText style={styles.label}>Cidade</ThemedText>
                <TextInput
                  style={styles.input}
                  value={editCidade}
                  onChangeText={setEditCidade}
                  placeholder="Cidade"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.label}>UF</ThemedText>
                <TextInput
                  style={styles.input}
                  value={editUf}
                  onChangeText={setEditUf}
                  placeholder="UF"
                  placeholderTextColor="#9ca3af"
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </>
        )}
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>Minhas competências</ThemedText>
      {competenciasUsuario.length === 0 ? (
        <ThemedText style={styles.empty}>Você ainda não possui competências associadas.</ThemedText>
      ) : (
        <View style={styles.chipsRow}>
          {competenciasUsuario.map((c) => (
            <React.Fragment key={c.id}>
              <View style={[styles.chipActive, { backgroundColor: accent }]}>
                <ThemedText style={styles.chipText}>{c.nome}</ThemedText>
              </View>
            </React.Fragment>
          ))}
        </View>
      )}

      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 16 }]}>Adicionar/Remover competências</ThemedText>
      {todasCompetencias.map((item) => {
        const selected = competenciasUsuario.some((c) => c.id === item.id);
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.compRow, selected && { borderColor: accent }]}
            onPress={() => handleToggleCompetencia(item.id)}
          >
            <ThemedText style={styles.compName}>{item.nome}</ThemedText>
            <ThemedText style={styles.compArea}>{item.area || 'Área geral'}</ThemedText>
            <ThemedText style={[styles.compAction, { color: accent }]}>{selected ? 'Remover' : 'Adicionar'}</ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    color: '#f9fafb',
    fontSize: 14,
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
