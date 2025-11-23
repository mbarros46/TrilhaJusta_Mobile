import client from './axiosApi';

export interface CompetenciaDTO {
  id: number;
  nome: string;
  area?: string | null;
  nivelPadrao?: number | null;
}

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  uf: string;
  competencias?: CompetenciaDTO[];
}

export const usuariosService = {
  async getById(id: number): Promise<UsuarioDTO> {
    const res = await client.get<UsuarioDTO>(`/usuarios/${id}`);
    return res.data;
  },

  // Tenta obter o usuário atual usando endpoints "me" comuns.
  async getMe(): Promise<UsuarioDTO | null> {
    const candidates = ['/me', '/usuarios/me', '/usuario/me', '/auth/me'];
    for (const path of candidates) {
      try {
        const res = await client.get<UsuarioDTO>(path);
        if (res && res.data) return res.data;
      } catch (e: any) {
        // se 404/401/403, tentar próximo candidato
        if (e.response && (e.response.status === 404 || e.response.status === 401 || e.response.status === 403)) {
          continue;
        }
        // outros erros de rede: continue tentando outras rotas
        continue;
      }
    }
    return null;
  },

  async addCompetencia(usuarioId: number, competenciaId: number): Promise<UsuarioDTO> {
    const res = await client.post<UsuarioDTO>(`/usuarios/${usuarioId}/competencias/${competenciaId}`);
    return res.data;
  },

  async removeCompetencia(usuarioId: number, competenciaId: number): Promise<UsuarioDTO> {
    const res = await client.delete<UsuarioDTO>(`/usuarios/${usuarioId}/competencias/${competenciaId}`);
    return res.data;
  },
};
