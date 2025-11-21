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

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, registerDev } = useAuth();

  async function handleRegister() {
    if (!nome || !email || !senha || !cidade || !uf) {
      Alert.alert('Cadastro', 'Preencha todos os campos.');
      return;
    }
    try {
      setLoading(true);
  await register(nome, email, senha, cidade, uf);
      Alert.alert('Cadastro realizado', 'Conta criada com sucesso!');
      router.replace('/(tabs)');
    } catch (err: any) {
        console.error('Erro no cadastro:', err);
        const msg = err?.message || 'Tente novamente.';
        // Se for erro de timeout / rede, oferecer modo dev
        if (msg.toLowerCase().includes('timeout') || msg.toLowerCase().includes('network')) {
          Alert.alert('Erro ao cadastrar', `${msg}`, [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Continuar em modo dev',
              onPress: async () => {
                try {
                  await registerDev(nome, email);
                  Alert.alert('Cadastro (dev)', 'Entrando em modo desenvolvimento');
                  router.replace('/(tabs)');
                } catch (e) {
                  Alert.alert('Erro', 'Não foi possível entrar em modo dev.');
                }
              },
            },
          ]);
        } else {
          Alert.alert('Erro ao cadastrar', msg);
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
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados para começar sua jornada.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            placeholderTextColor="#9ca3af"
          />
        </View>

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

        <View style={styles.row}>
          <View style={[styles.field, styles.flex2]}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={styles.input}
              value={cidade}
              onChangeText={setCidade}
              placeholder="Sua cidade"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={[styles.field, styles.flex1]}>
            <Text style={styles.label}>UF</Text>
            <TextInput
              style={styles.input}
              value={uf}
              onChangeText={setUf}
              placeholder="SP"
              placeholderTextColor="#9ca3af"
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <AppButton
          title={loading ? 'Cadastrando...' : 'Cadastrar'}
          onPress={handleRegister}
          disabled={loading}
        />

        <Text style={styles.footerText}>
          Já tem conta?{' '}
          <Text style={styles.footerLink} onPress={() => router.replace('/auth/login')}>
            Fazer login
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
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
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
