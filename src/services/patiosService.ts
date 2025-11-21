// FleetZone_mobile-main/src/services/patiosService.ts
import { apiConfig, authenticatedFetch } from './api';

export interface Patio {
  id: number;
  nome: string;
  localizacao?: string;
}

export interface PatioRelatorio {
  id: number;
  nome: string;
  totalMotos: number;
  motosDisponiveis?: number;
  motosManutencao?: number;
  motosAlugadas?: number;
  localizacao?: string;
}

// Backend exposes pátios/filiais under /filiais — align with API
const base = `${apiConfig.baseURL}/filiais`;

export const patiosService = {
  async list(token?: string): Promise<Patio[]> {
    const r = await authenticatedFetch(base, { method: 'GET' }, token);
    return r.json();
  },
  async get(id: number, token?: string): Promise<Patio> {
    const r = await authenticatedFetch(`${base}/${id}`, { method: 'GET' }, token);
    return r.json();
  },
  async create(data: Partial<Patio>, token?: string): Promise<Patio> {
    const r = await authenticatedFetch(base, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }, token);
    return r.json();
  },
  async update(id: number, data: Partial<Patio>, token?: string): Promise<Patio> {
    const r = await authenticatedFetch(`${base}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }, token);
    return r.json();
  },
  async remove(id: number, token?: string): Promise<void> {
    await authenticatedFetch(`${base}/${id}`, { method: 'DELETE' }, token);
  },
  async relatorio(token?: string): Promise<PatioRelatorio[]> {
    const r = await authenticatedFetch(`${base}/relatorio`, { method: 'GET' }, token);
    return r.json();
  },
};
