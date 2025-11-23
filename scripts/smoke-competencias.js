#!/usr/bin/env node
/* Smoke test para competências do usuário

  Requisitos no .env:
    EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
    EXPO_SMOKE_EMAIL=usuario@exemplo.com
    EXPO_SMOKE_PASS=senha
    EXPO_SMOKE_USER_ID=1

  Fluxo:
    - Faz login e obtém token
    - Lista todas competências (GET /competencias)
    - Tenta adicionar a primeira competência ao usuário atual (POST /usuarios/{id}/competencias/{compId} ou /me/competencias)
    - Tenta remover a competência adicionada
*/

const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const API_BASE = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');
const SMOKE_EMAIL = process.env.EXPO_SMOKE_EMAIL;
const SMOKE_PASS = process.env.EXPO_SMOKE_PASS;
const SMOKE_USER_ID = process.env.EXPO_SMOKE_USER_ID || process.env.EXPO_PUBLIC_DEFAULT_USER_ID || '1';
const STATIC_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

async function login() {
  if (STATIC_TOKEN) {
    console.log('Usando token estático de EXPO_PUBLIC_API_TOKEN (pular login)');
    return STATIC_TOKEN;
  }
  const resp = await axios.post(`${API_BASE}/auth/login`, { email: SMOKE_EMAIL, senha: SMOKE_PASS }, { timeout: 10000 });
  const token = resp.data?.token || resp.data?.accessToken;
  if (!token) throw new Error('No token returned from login');
  return token;
}

async function listCompetencias(token) {
  const resp = await axios.get(`${API_BASE}/competencias`, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
  return resp.data && (Array.isArray(resp.data) ? resp.data : resp.data.content || resp.data.items || []);
}

async function addCompetencia(token, usuarioId, compId) {
  const resp = await axios.post(`${API_BASE}/usuarios/${usuarioId}/competencias/${compId}`, null, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
  return resp.data;
}

async function removeCompetencia(token, usuarioId, compId) {
  const resp = await axios.delete(`${API_BASE}/usuarios/${usuarioId}/competencias/${compId}`, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
  return resp.data;
}

(async () => {
  console.log('Smoke competencias — API base:', API_BASE);
  if (!STATIC_TOKEN && (!SMOKE_EMAIL || !SMOKE_PASS)) {
    console.error('Defina EXPO_PUBLIC_API_TOKEN OU (EXPO_SMOKE_EMAIL e EXPO_SMOKE_PASS) no .env para rodar este teste');
    process.exit(2);
  }

  try {
    const token = await login();
    console.log('Token obtido');

    const comps = await listCompetencias(token);
    if (!comps || comps.length === 0) {
      console.error('Nenhuma competencia encontrada. Abortando.');
      process.exit(2);
    }
    const comp = comps[0];
    console.log('Usando competencia:', comp.id, comp.nome || '<sem nome>');

    const added = await addCompetencia(token, SMOKE_USER_ID, comp.id);
    console.log('Competencia adicionada:', JSON.stringify(added, null, 2));

    const removed = await removeCompetencia(token, SMOKE_USER_ID, comp.id);
    console.log('Competencia removida (resposta):', JSON.stringify(removed, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Erro:', (err.response && err.response.data) || err.message || err);
    process.exit(3);
  }
})();
