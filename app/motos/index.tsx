import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView, ThemedText } from '../../src/components';

export default function MotosRemoved() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Funcionalidade removida</ThemedText>
      <ThemedText>A seção de "motos" foi removida deste projeto TrilhaJusta.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
