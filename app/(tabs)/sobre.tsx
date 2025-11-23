import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';
import { useThemeColor } from '../../hooks/useThemeColor';

// tentar ler hash do commit gerado em build/script
let commitHash = 'NÃO INFORMADO';
try {
  // import dinâmico para evitar erros em bundlers que não aceitam import estático de JSON
  // caminho relativo da tela para assets/commit.json
  // @ts-ignore
  const commit = require('../../assets/commit.json');
  if (commit && commit.hash) commitHash = commit.hash;
} catch (e) {
  // não crítico
}

export default function SobreScreen() {
  useProtectedScreen();
  const accent = useThemeColor({}, 'accent');
  const background = useThemeColor({}, 'background');

  return (
  <ScrollView contentContainerStyle={[styles.container, { backgroundColor: background }] }>
      <Text style={styles.title}>Sobre o app</Text>
      <Text style={styles.text}>
        TrilhaJusta é um protótipo acadêmico de uma plataforma de requalificação justa e recrutamento
        inclusivo, conectando trabalhadores a trilhas de aprendizagem, cursos e vagas com critérios
        transparentes.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stack Mobile</Text>
        <Text style={styles.text}>React Native + Expo Router (SDK 54)</Text>
        <Text style={styles.text}>Integração com backend Java Spring Boot (API /api/v1)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Funcionalidades demonstradas</Text>
        <Text style={styles.text}>• Autenticação com JWT (login/cadastro)</Text>
        <Text style={styles.text}>• Listagem de trilhas e cursos</Text>
        <Text style={styles.text}>• Listagem de vagas e candidatura</Text>
        <Text style={styles.text}>• CRUD de competências do usuário</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Commit / Build</Text>
        <Text style={styles.text}>
          Hash do commit (se definido em env):
        </Text>
  <Text style={[styles.text, { marginTop: 6, color: accent }]}>{commitHash}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 8,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: '#cbd5f5',
    marginBottom: 2,
  },
});
