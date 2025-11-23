import client from './axiosApi';
import type { VagaDTO } from './vagasService';

// Declaração de tipos para variáveis de ambiente Expo
declare const process: {
  env: {
    EXPO_PUBLIC_DEFAULT_USER_ID?: string;
  };
};

export type CandidaturaStatus = 'SUBMETIDA' | 'EM_ANALISE' | 'APROVADA' | 'REPROVADA';

export interface CandidaturaDTO {
  id: number;
  status: CandidaturaStatus;
  vaga: VagaDTO;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const DEFAULT_USER_ID = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DEFAULT_USER_ID)
  ? parseInt(process.env.EXPO_PUBLIC_DEFAULT_USER_ID, 10)
  : 1;

export const candidaturasService = {
  async list(page = 0, size = 20, usuarioId?: number): Promise<Page<CandidaturaDTO>> {
    const params: any = { page, size };
    if (typeof usuarioId === 'number') params.usuarioId = usuarioId;
    const res = await client.get<Page<CandidaturaDTO>>('/candidaturas', { params });
    return res.data;
  },

  async create(vagaId: number, usuarioId?: number): Promise<CandidaturaDTO> {
    const uid = usuarioId ?? DEFAULT_USER_ID;
    const res = await client.post<CandidaturaDTO>('/candidaturas', null, {
      params: { usuarioId: uid, vagaId },
    });
    return res.data;
  },

  async updateStatus(id: number, status: CandidaturaStatus): Promise<CandidaturaDTO> {
    const res = await client.patch<CandidaturaDTO>(`/candidaturas/${id}`, { status });
    return res.data;
  },

  async getById(id: number): Promise<CandidaturaDTO> {
    const res = await client.get<CandidaturaDTO>(`/candidaturas/${id}`);
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await client.delete(`/candidaturas/${id}`);
  },
};
