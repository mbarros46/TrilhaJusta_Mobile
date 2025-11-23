import client, { setAuthToken } from './axiosApi';

// Declaração de tipos para variáveis de ambiente Expo
declare const process: {
  env: {
    EXPO_PUBLIC_DEFAULT_USER_ID?: string;
    EXPO_ENABLE_DEV_AUTH?: string;
  };
};

interface UsuarioCliente {
  id: string;
  nome: string;
  email: string;
}

const DEFAULT_USER_ID = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DEFAULT_USER_ID)
  ? process.env.EXPO_PUBLIC_DEFAULT_USER_ID
  : '1';

const DEV_AUTH = (typeof process !== 'undefined' && process.env?.EXPO_ENABLE_DEV_AUTH === 'true');

function isNetworkTimeoutError(err: any) {
  if (!err) return false;
  const msg = err.message || '';
  const code = err.code || '';
  return msg.toLowerCase().includes('timeout') || msg.toLowerCase().includes('network error') || code === 'ECONNABORTED';
}

/**
 * Real signup contra a API Java TrilhaJusta.
 * Fluxo esperado:
 *  - POST /auth/signup (200/201) -> pode não retornar body
 *  - Se não retornar token, fazemos POST /auth/login para obter o token JWT
 */
export async function register(nome: string, email: string, senha: string, cidade: string, uf: string) {
  try {
    // Payload ajustado para o backend TrilhaJusta
    const payload = {
      nome,
      email,
      passwordHash: senha, // Backend espera 'passwordHash' em vez de 'senha'
      cidade,
      uf,
      role: 'USER', // Role padrão
      competencias: [], // Lista vazia inicial
    };

    // Tentar diferentes endpoints de cadastro
    let signupResp;
    try {
      // Primeiro tenta POST /usuarios (endpoint RESTful padrão)
      signupResp = await client.post('/usuarios', payload);
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        // Se não existir, tenta /auth/signup
        try {
          signupResp = await client.post('/auth/signup', payload);
        } catch (e2: any) {
          if (e2.response && e2.response.status === 404) {
            // Tenta /auth/register
            signupResp = await client.post('/auth/register', payload);
          } else {
            throw e2;
          }
        }
      } else {
        throw e;
      }
    }

    // Alguns backends retornam token já no signup; suportamos ambos os casos.
    const data = signupResp?.data || {};
    const tokenFromSignup = data.token || (data as any).accessToken;

    if (tokenFromSignup) {
      setAuthToken(tokenFromSignup);
      // Tentar buscar o usuário real com o token
      const fetched = await fetchCurrentUser();
      const usuario: UsuarioCliente = fetched ?? {
        id: DEFAULT_USER_ID,
        nome: nome || (email.split('@')[0] || 'Usuário'),
        email,
      };
      return { token: tokenFromSignup, usuario };
    }

    // Caso signup não retorne token, fazemos login para obter o token
    const loginData = await loginInternal(email, senha);
    return loginData;
  } catch (err: any) {
    // Fallback em dev: somente se EXPO_ENABLE_DEV_AUTH=true. Não usar fallback automático em ambiente de avaliação.
    if (DEV_AUTH) {
      console.warn('[authService] signup failed, falling back to dev token:', err?.message || err);
      const mockToken = `dev-token-${Math.random().toString(36).slice(2, 10)}`;
      setAuthToken(mockToken);
      const usuario: UsuarioCliente = {
        id: DEFAULT_USER_ID,
        nome: nome || (email.split('@')[0] || 'Usuário Dev'),
        email,
      };
      return { token: mockToken, usuario };
    }

    // Normalizar mensagem de erro para ser mostrada na UI
    if (err.response) {
      const status = err.response.status;
      const payload = err.response.data;
      const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const message = `${status}: ${body}`;
      console.error('[authService] signup error response:', status, payload);
      throw new Error(message);
    }

    console.error('[authService] signup unexpected error:', err);
    throw new Error(err.message || 'Erro ao realizar cadastro');
  }
}

async function loginInternal(email: string, senha: string): Promise<{ token: string; usuario: UsuarioCliente }> {
  try {
    // Tentar primeiro com 'senha', se falhar tentar com 'passwordHash'
    let resp;
    try {
      resp = await client.post('/auth/login', { email, senha });
    } catch (e: any) {
      // Se der erro 400 (bad request), pode ser que o backend espere 'passwordHash'
      if (e.response && (e.response.status === 400 || e.response.status === 401)) {
        resp = await client.post('/auth/login', { email, passwordHash: senha });
      } else {
        throw e;
      }
    }
    const data = resp?.data || {};
    const token = data.token || (data as any).accessToken;
    if (!token) {
      throw new Error('Resposta de login sem token');
    }

    setAuthToken(token);

    // Tentar obter perfil completo do usuário com o token
    const fetched = await fetchCurrentUser();
    const usuario: UsuarioCliente = fetched ?? {
      id: DEFAULT_USER_ID,
      nome: data.usuario?.nome || email.split('@')[0] || 'Usuário',
      email,
    };

    return { token, usuario };
  } catch (err: any) {
    if (DEV_AUTH) {
      console.warn('[authService] login failed, falling back to dev token:', err?.message || err);
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
    if (err.response) {
      const status = err.response.status;
      const payload = err.response.data;
      const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const message = `${status}: ${body}`;
      console.error('[authService] login error response:', status, payload);
      throw new Error(message);
    }

    console.error('[authService] login unexpected error:', err);
    throw new Error(err.message || 'Erro ao autenticar');
  }
}

// Tenta buscar o usuário atual a partir do endpoint padrão. Retorna null se não existente.
async function fetchCurrentUser(): Promise<UsuarioCliente | null> {
  const candidates = ['/usuarios/me', '/usuario/me', '/users/me', '/auth/me'];
  for (const path of candidates) {
    try {
      const res = await client.get(path);
      if (res && res.data) {
        const d = res.data;
        // aceitar formatos variados
        const id = d.id || d.userId || d.usuarioId || d.codigo || d._id || DEFAULT_USER_ID;
        const nome = d.nome || d.name || (d.usuario && d.usuario.nome) || '';
        const email = d.email || d.usuario?.email || '';
        return { id: String(id), nome: nome || email.split('@')[0] || 'Usuário', email };
      }
    } catch (e: any) {
      // se 404, tentar próximo; se 401/403 provavelmente token válido porém bloqueado - retornar null
      if (e.response && (e.response.status === 404 || e.response.status === 403 || e.response.status === 401)) {
        // continuar para próximo candidato
        continue;
      }
      // outros erros de rede — apenas continue tentando as outras rotas
      continue;
    }
  }
  return null;
}

export async function login(email: string, senha: string) {
  return loginInternal(email, senha);
}
