import client from './axiosApi';

export interface FilialDTO {
  id?: number;
  nome: string;
  endereco?: string;
}

const base = '/filiais';

export const filiaisService = {
  async list(): Promise<FilialDTO[]> {
    try {
      const { data } = await client.get(base);
      return data;
    } catch (err) {
      console.warn('filiaisService.list failed:', err);
      return [];
    }
  },
  async get(id: number): Promise<FilialDTO> {
    const { data } = await client.get(`${base}/${id}`);
    return data;
  },
};
