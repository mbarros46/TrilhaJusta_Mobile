// Configuração base para chamadas de API
// No Expo, as variáveis EXPO_PUBLIC_ são disponibilizadas automaticamente
declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_API_TOKEN?: string;
  };
};

// Default base URL for local development (backend Java API)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Tipos específicos de entidades devem viver em seus próprios serviços.
// Este arquivo mantém apenas configuração base e helpers de autenticação.
// Headers com autenticação
export const getAuthHeaders = (token?: string) => ({
  ...apiConfig.headers,
  ...(token || process.env.EXPO_PUBLIC_API_TOKEN ? { Authorization: `Bearer ${token ?? process.env.EXPO_PUBLIC_API_TOKEN}` } : {}),
});

// Função helper para requisições autenticadas
export const authenticatedFetch = async (url: string, options: RequestInit = {}, token?: string) => {
  const controller = new AbortController();
  const timeout = apiConfig.timeout ?? 10000;
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(token),
        ...options.headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
};
