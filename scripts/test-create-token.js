const axios = require('axios');

const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8085';
const token = 'dev-mobile-token-9f3b2c7a1d4e5f6a8b7c9d0e1f2a3b4c';

(async () => {
  try {
    console.log('POST', `${BASE}/motos`);
    const payload = { modelo: 'Teste Dev Token', placa: 'DEV-0001', status: 'Disponível' };
    const r = await axios.post(`${BASE}/motos`, payload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 8000, maxRedirects: 0 });
    console.log('Status:', r.status);
    console.log('Data:', r.data);
  } catch (err) {
    console.error('Request failed');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Headers:', err.response.headers);
      try { console.error('Data:', JSON.stringify(err.response.data, null, 2)); } catch(e) { console.error('Data (raw):', err.response.data); }
    } else {
      console.error('Error message:', err.message);
    }
    process.exit(1);
  }
})();
