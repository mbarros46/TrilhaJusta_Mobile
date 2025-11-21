import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AppButton from '../src/components/AppButton';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.badge}>TrilhaJusta</Text>
      <Text style={styles.title}>Requalificação justa e recrutamento inclusivo</Text>
      <Text style={styles.subtitle}>
        Conecte seu perfil a trilhas de aprendizagem, cursos e vagas com critérios transparentes.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Descubra suas trilhas</Text>
        <Text style={styles.cardText}>
          Veja trilhas de requalificação alinhadas às suas competências e objetivos.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. Acompanhe seu progresso</Text>
        <Text style={styles.cardText}>
          Marque cursos concluídos e acompanhe seu avanço nas trilhas.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. Candidate-se com transparência</Text>
        <Text style={styles.cardText}>
          Visualize vagas, requisitos de competência e acompanhe o status das candidaturas.
        </Text>
      </View>

      <AppButton title="Começar" onPress={() => router.replace('/auth/login')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 80,
    alignItems: 'stretch',
    backgroundColor: '#0a1020',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4c6fff',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#d0d4ff',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#141b35',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: '#d0d4ff',
  },
});
