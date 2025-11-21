import client from './axiosApi';
import type { CompetenciaDTO } from './usuariosService';

export interface VagaDTO {
  id: number;
  empresa: string;
  titulo: string;
  cidade: string;
  uf: string;
  descricao?: string | null;
  competenciasRequeridas?: CompetenciaDTO[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const vagasService = {
  async list(page = 0, size = 20): Promise<Page<VagaDTO>> {
    const res = await client.get<Page<VagaDTO>>('/vagas', {
      params: { page, size },
    });
    return res.data;
  },

  async get(id: number): Promise<VagaDTO> {
    const res = await client.get<VagaDTO>(`/vagas/${id}`);
    return res.data;
  },
};
