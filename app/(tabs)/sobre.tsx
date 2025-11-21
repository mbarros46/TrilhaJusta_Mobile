import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';

export default function SobreScreen() {
  useProtectedScreen();

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          Informe aqui o hash do commit publicado no Firebase App Distribution, conforme rubrica.
        </Text>
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
