import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts';

/**
 * Garante que a tela seja acessada apenas com usuário autenticado.
 * Se não houver token, redireciona para /auth/login.
 */
export function useProtectedScreen() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/auth/login');
    }
  }, [token, router]);
}
