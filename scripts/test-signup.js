#!/usr/bin/env node
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

(async () => {
  const API_BASE = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');
  const url = `${API_BASE}/auth/signup`;
  const timestamp = Date.now();
  const payload = {
    nome: `Teste Automático ${timestamp}`,
    email: `teste+${timestamp}@example.com`,
    senha: 'Senha123!@#',
    cidade: 'São Paulo',
    uf: 'SP'
  };

  console.log('Tentando signup em', url);
  console.log('Payload:', payload);

  try {
    const resp = await axios.post(url, payload, { timeout: 10000 });
    console.log('Status:', resp.status);
    console.log('Resposta:', JSON.stringify(resp.data, null, 2));
    process.exit(0);
  } catch (err) {
    if (err.response) {
      console.error('Erro HTTP:', err.response.status, err.response.data);
    } else {
      console.error('Erro de rede/timeout:', err.message);
    }
    process.exit(2);
  }
})();
