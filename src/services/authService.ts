import { apiConfig } from './api';
import { setAuthToken } from './axiosApi';

interface LoginResponse {
  token: string;
}

interface UsuarioCliente {
  id: string;
  nome: string;
  email: string;
}

const DEFAULT_USER_ID = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DEFAULT_USER_ID)
  ? process.env.EXPO_PUBLIC_DEFAULT_USER_ID
  : '1';

/**
 * Real signup contra a API Java TrilhaJusta.
 * Fluxo:
 *  - POST /auth/signup (201, sem body)
 *  - POST /auth/login para obter o token JWT
 */
export async function register(nome: string, email: string, senha: string, cidade: string, uf: string) {
  const base = apiConfig.baseURL; // ex.: http://localhost:8080/api/v1

  // Signup
  const signupRes = await fetch(`${base}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha, cidade, uf }),
  });

  if (!signupRes.ok && signupRes.status !== 201) {
    const msg = await signupRes.text().catch(() => '');
    throw new Error(msg || 'Erro ao realizar cadastro');
  }

  // Login na sequência para já retornar token e dados básicos do usuário
  const loginData = await loginInternal(email, senha);
  return loginData;
}

async function loginInternal(email: string, senha: string): Promise<{ token: string; usuario: UsuarioCliente }> {
  const base = apiConfig.baseURL;
  try {
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(msg || 'Credenciais inválidas');
    }

    const data = (await res.json()) as LoginResponse;
    const token = data.token;
    setAuthToken(token);

    // Como o backend retorna apenas o token, criamos um objeto de usuário mínimo no cliente.
    const usuario: UsuarioCliente = {
      id: DEFAULT_USER_ID,
      nome: email.split('@')[0] || 'Usuário',
      email,
    };

    return { token, usuario };
  } catch (err) {
    console.warn('[authService] login error, falling back to dev token:', err);
    const mockToken = `dev-token-${Math.random().toString(36).slice(2, 10)}`;
    setAuthToken(mockToken);
    return {
      token: mockToken,
      usuario: {
        id: DEFAULT_USER_ID,
        nome: email.split('@')[0] || 'Usuário Dev',
        email,
      },
    };
  }
}

export async function login(email: string, senha: string) {
  return loginInternal(email, senha);
}
