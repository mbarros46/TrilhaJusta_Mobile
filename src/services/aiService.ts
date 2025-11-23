import client from './axiosApi';

export interface RecomendacaoRequest {
  perfil?: {
    competencias?: number[];
    objetivos?: string;
    experiencia?: string;
  };
}

export interface RecomendacaoResponse {
  recomendacao: string;
}

export const aiService = {
  async recomendarTrilhas(perfil: RecomendacaoRequest): Promise<string> {
    const res = await client.post<RecomendacaoResponse>('/ai/recomendar-trilhas', perfil);
    return res.data.recomendacao || res.data as unknown as string;
  },
};