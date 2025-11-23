import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AppButton from '../../src/components/AppButton';
import { useProtectedScreen } from '../../src/hooks/useProtectedScreen';

export default function DashboardScreen() {
  useProtectedScreen();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Olá!</Text>
      <Text style={styles.subtitle}>
        Este é o painel principal da TrilhaJusta. Acesse rapidamente trilhas, vagas e suas candidaturas.
      </Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Minhas Trilhas</Text>
          <Text style={styles.cardText}>Visualize trilhas de requalificação e cursos sugeridos.</Text>
          <AppButton title="Ver trilhas" onPress={() => router.push('/(tabs)/trilhas')} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vagas recomendadas</Text>
          <Text style={styles.cardText}>Confira as vagas disponíveis e seus requisitos.</Text>
          <AppButton title="Ver vagas" onPress={() => router.push('/(tabs)/vagas')} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Minhas competências</Text>
          <Text style={styles.cardText}>Gerencie as competências associadas ao seu perfil.</Text>
          <AppButton title="Gerenciar perfil" onPress={() => router.push('/(tabs)/perfil')} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Candidaturas</Text>
          <Text style={styles.cardText}>Veja para quais vagas você já se candidatou e o status.</Text>
          <AppButton title="Minhas candidaturas" onPress={() => router.push('/candidaturas/index')} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recomendações por IA</Text>
          <Text style={styles.cardText}>Receba sugestões personalizadas de trilhas e cursos.</Text>
          <AppButton title="Receber recomendações" onPress={() => router.push('/ai/recomendacoes')} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 8,
  },
});
