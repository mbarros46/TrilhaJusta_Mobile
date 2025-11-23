#!/usr/bin/env node
/* Smoke test para candidaturas

  Requisitos no .env:
    EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
    EXPO_SMOKE_EMAIL=usuario@exemplo.com
    EXPO_SMOKE_PASS=senha
    EXPO_SMOKE_USER_ID=1 (opcional)

  Fluxo:
    - Faz login e obtém token
    - Lista vagas (GET /vagas) e pega a primeira
    - Cria candidatura (POST /candidaturas?usuarioId=&vagaId=)
    - Lista candidaturas e confirma existência
    - Deleta a candidatura criada
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
  console.log('Login with', SMOKE_EMAIL);
  const resp = await axios.post(`${API_BASE}/auth/login`, { email: SMOKE_EMAIL, senha: SMOKE_PASS }, { timeout: 10000 });
  const token = resp.data?.token || resp.data?.accessToken;
  if (!token) throw new Error('No token returned from login');
  return token;
}

async function listVagas(token) {
  const resp = await axios.get(`${API_BASE}/vagas`, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
  return resp.data && (Array.isArray(resp.data) ? resp.data : resp.data.content || resp.data.items || []);
}

async function createCandidatura(token, usuarioId, vagaId) {
  const resp = await axios.post(`${API_BASE}/candidaturas`, null, { params: { usuarioId, vagaId }, headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
  return resp.data;
}

async function listCandidaturas(token) {
  const resp = await axios.get(`${API_BASE}/candidaturas`, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
  return resp.data && (Array.isArray(resp.data) ? resp.data : resp.data.content || []);
}

async function deleteCandidatura(token, id) {
  await axios.delete(`${API_BASE}/candidaturas/${id}`, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
}

(async () => {
  console.log('Smoke candidaturas — API base:', API_BASE);
  if (!STATIC_TOKEN && (!SMOKE_EMAIL || !SMOKE_PASS)) {
    console.error('Defina EXPO_PUBLIC_API_TOKEN OU (EXPO_SMOKE_EMAIL e EXPO_SMOKE_PASS) no .env para rodar este teste');
    process.exit(2);
  }

  try {
    const token = await login();
    console.log('Token obtido (oculto)');

    const vagas = await listVagas(token);
    if (!vagas || vagas.length === 0) {
      console.error('Nenhuma vaga encontrada para candidatar. Abortando.');
      process.exit(2);
    }
    const vaga = vagas[0];
    console.log('Usando vaga:', vaga.id, vaga.titulo || vaga.name || '<sem titulo>');

    const created = await createCandidatura(token, SMOKE_USER_ID, vaga.id);
    console.log('Candidatura criada:', JSON.stringify(created, null, 2));

    const list = await listCandidaturas(token);
    const found = list.find((c) => String(c.id) === String(created.id));
    if (found) console.log('Candidatura presente na listagem. OK');
    else console.warn('Candidatura NÃO encontrada na listagem');

    // Cleanup
    try {
      await deleteCandidatura(token, created.id);
      console.log('Candidatura removida (cleanup)');
    } catch (e) {
      console.warn('Falha ao remover candidatura criada:', e.message || e);
    }

    process.exit(0);
  } catch (err) {
    console.error('Erro:', (err.response && err.response.data) || err.message || err);
    process.exit(3);
  }
})();
