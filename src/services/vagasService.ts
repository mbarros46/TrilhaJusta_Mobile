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
  async list(
    page = 0,
    size = 20,
    filters?: { competencias?: number[] | string; cidade?: string }
  ): Promise<Page<VagaDTO>> {
    const params: any = { page, size };
    if (filters?.cidade) params.cidade = filters.cidade;
    if (filters?.competencias) {
      params.competencias = Array.isArray(filters.competencias)
        ? filters.competencias.join(',')
        : filters.competencias;
    }
    const res = await client.get<Page<VagaDTO>>('/vagas', { params });
    return res.data;
  },

  async get(id: number): Promise<VagaDTO> {
    const res = await client.get<VagaDTO>(`/vagas/${id}`);
    return res.data;
  },
};
