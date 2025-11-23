import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { useAuth } from '../../src/contexts';
import { aiService } from '../../src/services/aiService';
import AppButton from '../../src/components/AppButton';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function RecomendacoesAIScreen() {
  useProtectedScreen();
  const { usuario } = useAuth();
  const [objetivos, setObjetivos] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [loading, setLoading] = useState(false);
  const [recomendacao, setRecomendacao] = useState('');
  const accent = useThemeColor({}, 'accent');
  const background = useThemeColor({}, 'background');

  async function handleRecomendar() {
    if (!objetivos && !experiencia) {
      Alert.alert('Atenção', 'Informe seus objetivos ou experiência para receber recomendações.');
      return;
    }
    try {
      setLoading(true);
      const res = await aiService.recomendarTrilhas({
        perfil: {
          objetivos,
          experiencia,
        },
      });
      setRecomendacao(res);
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Não foi possível obter recomendações.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: background }]}>
      <Text style={styles.title}>Recomendações por IA</Text>
      <Text style={styles.subtitle}>
        Informe seus objetivos e experiência para receber trilhas personalizadas.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Objetivos profissionais</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={objetivos}
          onChangeText={setObjetivos}
          placeholder="Ex: Quero me tornar desenvolvedor full-stack..."
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Experiência atual</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={3}
          value={experiencia}
          onChangeText={setExperiencia}
          placeholder="Ex: Trabalhei 5 anos como analista de sistemas..."
          placeholderTextColor="#9ca3af"
        />
      </View>

      <AppButton
        title={loading ? 'Consultando IA...' : 'Recomendar Trilhas'}
        onPress={handleRecomendar}
        disabled={loading}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accent} />
          <Text style={styles.loadingText}>Gerando recomendações...</Text>
        </View>
      )}

      {!!recomendacao && !loading && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Recomendações</Text>
          <Text style={styles.resultText}>{recomendacao}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    color: '#f9fafb',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#e5e7eb',
  },
  resultContainer: {
    marginTop: 24,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
});