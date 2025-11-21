import { apiConfig, authenticatedFetch } from './api';

export interface MotoDTO {
  id?: number;
  modelo: string;
  placa: string;
  status?: string;
  patioId?: number;
}

const base = `${apiConfig.baseURL}/motos`;

export const motosService = {
  async list(token?: string): Promise<MotoDTO[]> {
    try {
      const r = await authenticatedFetch(base, { method: 'GET' }, token);
      return r.json();
    } catch (err) {
      // Falha de rede/timeout — retornar lista vazia para não travar o UI
      console.warn('motosService.list failed:', err);
      return [];
    }
  },
  async get(id: number, token?: string): Promise<MotoDTO> {
    const r = await authenticatedFetch(`${base}/${id}`, { method: 'GET' }, token);
    return r.json();
  },
  async create(data: MotoDTO, token?: string): Promise<MotoDTO> {
    const r = await authenticatedFetch(
      base,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      },
      token,
    );
    return r.json();
  },
  async update(id: number, data: MotoDTO, token?: string): Promise<MotoDTO> {
    const r = await authenticatedFetch(
      `${base}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      },
      token,
    );
    return r.json();
  },
  async move(id: number, patioId: number, token?: string): Promise<MotoDTO> {
    const r = await authenticatedFetch(
      `${base}/${id}/mover?patioId=${patioId}`,
      { method: 'PUT' },
      token,
    );
    return r.json();
  },
  async remove(id: number, token?: string): Promise<void> {
    await authenticatedFetch(`${base}/${id}`, { method: 'DELETE' }, token);
  },
};