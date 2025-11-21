import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AppButton from '../../src/components/AppButton';
import { useAuth } from '../../src/contexts';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, loginDev } = useAuth();

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Login', 'Informe e-mail e senha.');
      return;
    }
    try {
      setLoading(true);
      await login(email, senha);
      router.replace('/(tabs)');
    } catch (err: any) {
        const msg = err?.message || 'Tente novamente.';
        if (msg.toLowerCase().includes('timeout') || msg.toLowerCase().includes('network')) {
          Alert.alert('Erro ao entrar', msg, [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Entrar em modo dev',
              onPress: async () => {
                try {
                  await loginDev(email);
                  router.replace('/(tabs)');
                } catch (e) {
                  Alert.alert('Erro', 'Não foi possível entrar em modo dev.');
                }
              },
            },
          ]);
        } else {
          Alert.alert('Erro ao entrar', msg);
        }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#050816' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Bem-vindo à TrilhaJusta</Text>
        <Text style={styles.subtitle}>Entre para acessar suas trilhas, cursos e vagas.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <AppButton title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />

        <Text style={styles.footerText}>
          Ainda não tem conta?{' '}
          <Text style={styles.footerLink} onPress={() => router.push('/auth/register')}>
            Cadastre-se
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f9fafb',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  footerText: {
    marginTop: 24,
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
  footerLink: {
    color: '#60a5fa',
    fontWeight: '600',
  },
});
