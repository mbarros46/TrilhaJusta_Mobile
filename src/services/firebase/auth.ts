// Serviços de autenticação do Firebase
// Aqui você pode adicionar suas funções de auth quando estiver pronto

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Funções de exemplo para implementar:
// export const signInWithEmail = async (email: string, password: string) => {};
// export const signUpWithEmail = async (email: string, password: string) => {};
// export const signOut = async () => {};
// export const getCurrentUser = () => {};