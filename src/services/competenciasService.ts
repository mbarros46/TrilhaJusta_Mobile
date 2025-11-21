import client from './axiosApi';
import type { CompetenciaDTO } from './usuariosService';

export const competenciasService = {
  async listAll(): Promise<CompetenciaDTO[]> {
    const res = await client.get<CompetenciaDTO[]>('/competencias');
    return res.data;
  },
};
