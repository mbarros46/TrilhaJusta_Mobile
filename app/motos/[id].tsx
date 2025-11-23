import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView, ThemedText } from '../../src/components';

export default function MotoDetailRemoved() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Removido</ThemedText>
      <ThemedText>Detalhes de motos foram removidos do projeto.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 18, fontWeight: '700' } });
