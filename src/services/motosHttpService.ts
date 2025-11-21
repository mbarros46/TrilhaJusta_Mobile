import client from './axiosApi';

export interface MotoDTO {
  id?: number;
  modelo: string;
  placa: string;
  status?: string;
  patioId?: number;
  km?: number;
}

const base = '/motos';

export const motosHttpService = {
  async list(): Promise<MotoDTO[]> {
    try {
      const { data } = await client.get(base);
      return data;
    } catch (err) {
      console.warn('motosHttpService.list failed:', err);
      return [];
    }
  },
  async get(id: number): Promise<MotoDTO> {
    const { data } = await client.get(`${base}/${id}`);
    return data;
  },
  async create(payload: MotoDTO): Promise<MotoDTO> {
    const { data } = await client.post(base, payload);
    return data;
  },
  async update(id: number, payload: MotoDTO): Promise<MotoDTO> {
    const { data } = await client.put(`${base}/${id}`, payload);
    return data;
  },
  async move(id: number, patioId: number): Promise<MotoDTO> {
    const { data } = await client.put(`${base}/${id}/mover`, null, { params: { patioId } });
    return data;
  },
  async remove(id: number): Promise<void> {
    await client.delete(`${base}/${id}`);
  },
};
