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

  async addCompetencia(usuarioId: number, competenciaId: number): Promise<UsuarioDTO> {
    const res = await client.post<UsuarioDTO>(`/usuarios/${usuarioId}/competencias/${competenciaId}`);
    return res.data;
  },

  async removeCompetencia(usuarioId: number, competenciaId: number): Promise<UsuarioDTO> {
    const res = await client.delete<UsuarioDTO>(`/usuarios/${usuarioId}/competencias/${competenciaId}`);
    return res.data;
  },
};
