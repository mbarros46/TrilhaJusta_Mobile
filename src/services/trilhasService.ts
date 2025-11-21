import client from './axiosApi';

export interface CursoDTO {
  id: number;
  titulo: string;
  cargaHoraria?: number | null;
  provedor?: string | null;
}

export interface TrilhaDTO {
  id: number;
  titulo: string;
  descricao?: string | null;
  cursos?: CursoDTO[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const trilhasService = {
  async list(page = 0, size = 20): Promise<Page<TrilhaDTO>> {
    const res = await client.get<Page<TrilhaDTO>>('/trilhas', {
      params: { page, size },
    });
    return res.data;
  },

  async listAll(): Promise<TrilhaDTO[]> {
    const page = await this.list(0, 100);
    return page.content;
  },

  async cursosByTrilha(trilhaId: number): Promise<CursoDTO[]> {
    const res = await client.get<CursoDTO[]>(`/trilhas/${trilhaId}/cursos`);
    return res.data;
  },
};
