#!/usr/bin/env node
/*
  scripts/smoke-test.js
  Smoke test para a API TrilhaJusta.

  Uso:
    - Configure no seu `.env` (na raiz do projeto):
        EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
        # ou o IP da máquina que executa o backend
        EXPO_SMOKE_EMAIL=usuario@exemplo.com
        EXPO_SMOKE_PASS=senha
    - Ou defina `EXPO_PUBLIC_API_TOKEN` para usar um token estático.
    - Rode: `npm run smoke-test` (no diretório do projeto)

  O script tentará:
    1) Se houver EXPO_PUBLIC_API_TOKEN, usá-lo.
    2) Senão, se houver EXPO_SMOKE_EMAIL/EXPO_SMOKE_PASS, fazer POST /auth/login e obter token.
    3) Fazer GET /trilhas e mostrar um resumo (status + número de itens ou erro).
*/

const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const STATIC_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;
const SMOKE_EMAIL = process.env.EXPO_SMOKE_EMAIL;
const SMOKE_PASS = process.env.EXPO_SMOKE_PASS;

async function run() {
  console.log('Smoke test TrilhaJusta — API base:', API_BASE);

  let token = STATIC_TOKEN;

  if (!token && SMOKE_EMAIL && SMOKE_PASS) {
    console.log('Tentando login com credenciais de smoke-test...');
    try {
      const resp = await axios.post(`${API_BASE.replace(/\/$/, '')}/auth/login`, {
        email: SMOKE_EMAIL,
        senha: SMOKE_PASS,
      }, { timeout: 10000 });

      if (resp && resp.data && (resp.data.token || resp.data.accessToken)) {
        token = resp.data.token || resp.data.accessToken;
        console.log('Login bem sucedido, token recebido (ocultando valor).');
      } else {
        console.warn('Login retornou sem token. Resposta:', JSON.stringify(resp.data));
      }
    } catch (err) {
      console.error('Erro no login:', (err.response && err.response.data) || err.message);
    }
  }

  if (!token) {
    console.log('Nenhum token disponível — farei uma requisição não autenticada a /trilhas (pode falhar se API exigir auth).');
  } else {
    console.log('Usando token para requisições autenticadas.');
  }

  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const resp = await axios.get(`${API_BASE.replace(/\/$/, '')}/trilhas`, { headers, timeout: 10000 });
    if (resp && resp.data) {
      const data = resp.data;
      // Tentar extrair lista de trilhas dependendo do formato (content, items ou array raiz)
      let items = [];
      if (Array.isArray(data)) items = data;
      else if (Array.isArray(data.content)) items = data.content;
      else if (Array.isArray(data.items)) items = data.items;

      console.log(`GET /trilhas -> status ${resp.status}. Trilhas encontradas: ${items.length}`);
      if (items.length > 0) console.log('Exemplo (primeira trilha):', JSON.stringify(items[0], null, 2));
      else console.log('Resposta completa:', JSON.stringify(data, null, 2));
    } else {
      console.log('GET /trilhas retornou sem corpo. Status:', resp.status);
    }
  } catch (err) {
    if (err.response) {
      console.error('Erro HTTP ao chamar /trilhas:', err.response.status, err.response.data);
    } else {
      console.error('Erro ao conectar em /trilhas:', err.message);
    }
    process.exitCode = 2;
  }
}

run().catch((e) => {
  console.error('Erro inesperado:', e && e.stack ? e.stack : e);
  process.exitCode = 3;
});
// end of script
