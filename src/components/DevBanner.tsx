import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts';

export default function DevBanner() {
  const { token } = useAuth();
  const [hidden, setHidden] = useState(false);

  const devEnabled = !!(token && typeof token === 'string' && token.startsWith('dev-token-'));
  if (!devEnabled || hidden) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Modo DEV ativo — fallback de autenticação habilitado.</Text>
      <TouchableOpacity onPress={() => setHidden(true)} style={styles.close}>
        <Text style={styles.closeText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f97316',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
  close: {
    padding: 6,
  },
  closeText: {
    color: '#fff',
    fontWeight: '700',
  },
});
