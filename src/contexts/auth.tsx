import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService, register as registerService } from '../services/authService';
import { setAuthToken } from '../services/axiosApi';

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextData {
  token: string | null;
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string, cidade?: string, uf?: string) => Promise<void>;
  loginDev: (email: string) => Promise<void>;
  registerDev: (nome: string, email: string) => Promise<void>;
  // cidade and uf are optional and forwarded to the backend during registration
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    loadStoragedData();
  }, []);

  async function loadStoragedData() {
    try {
      const storagedToken = await AsyncStorage.getItem('@FleetZone:token');
      const storagedUser = await AsyncStorage.getItem('@FleetZone:user');

      if (storagedToken && storagedUser) {
        setToken(storagedToken);
        // configure axios client with stored token
        setAuthToken(storagedToken);
        setUsuario(JSON.parse(storagedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do storage:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, senha: string) {
    try {
      setLoading(true);
      const response = await loginService(email, senha);
      
      const { token: authToken, usuario: authUsuario } = response;

      await AsyncStorage.setItem('@FleetZone:token', authToken);
      await AsyncStorage.setItem('@FleetZone:user', JSON.stringify(authUsuario));

      setToken(authToken);
  // set token for axios client
  setAuthToken(authToken);
      setUsuario(authUsuario);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function loginDev(email: string) {
    try {
      setLoading(true);
      const mockToken = `dev-token-${Math.random().toString(36).slice(2, 10)}`;
      const usuario = { id: String(Math.floor(Math.random() * 1000000)), nome: email.split('@')[0] || 'Dev', email };
      await AsyncStorage.setItem('@FleetZone:token', mockToken);
      await AsyncStorage.setItem('@FleetZone:user', JSON.stringify(usuario));
      setAuthToken(mockToken);
      setToken(mockToken);
      setUsuario(usuario);
    } catch (error) {
      console.error('Erro no loginDev:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function register(nome: string, email: string, senha: string, cidade?: string, uf?: string) {
    try {
      setLoading(true);
      const response = await registerService(nome, email, senha, cidade ?? '', uf ?? '');
      
      const { token: authToken, usuario: authUsuario } = response;

      await AsyncStorage.setItem('@FleetZone:token', authToken);
      await AsyncStorage.setItem('@FleetZone:user', JSON.stringify(authUsuario));

      setToken(authToken);
  // set token for axios client
  setAuthToken(authToken);
      setUsuario(authUsuario);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function registerDev(nome: string, email: string) {
    try {
      setLoading(true);
      const mockToken = `dev-token-${Math.random().toString(36).slice(2, 10)}`;
      const usuario = { id: String(Math.floor(Math.random() * 1000000)), nome: nome || email.split('@')[0] || 'Dev', email };
      await AsyncStorage.setItem('@FleetZone:token', mockToken);
      await AsyncStorage.setItem('@FleetZone:user', JSON.stringify(usuario));
      setAuthToken(mockToken);
      setToken(mockToken);
      setUsuario(usuario);
    } catch (error) {
      console.error('Erro no registerDev:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem('@FleetZone:token');
      await AsyncStorage.removeItem('@FleetZone:user');
      
      setToken(null);
      // clear axios auth header
      setAuthToken();
      setUsuario(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        loading,
        login,
        register,
        loginDev,
        registerDev,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}