const axios = require('axios');

const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8085';

async function run() {
  console.log('Smoke test base URL:', BASE);
  const results = [];

  // Auth login (try, may return 401)
  try {
    // don't follow redirects so we can detect if server expects form login / redirects
    const r = await axios.post(`${BASE}/auth/login`, { email: 'test@example.com', senha: '123456' }, { timeout: 5000, maxRedirects: 0 });
    results.push({ endpoint: '/auth/login', ok: true, status: r.status });
  } catch (err) {
    // axios will throw on non-2xx or redirect when maxRedirects=0
    const resp = err.response;
    if (resp) {
      results.push({ endpoint: '/auth/login', ok: false, status: resp.status, headers: resp.headers, data: resp.data });
    } else {
      results.push({ endpoint: '/auth/login', ok: false, message: err.message });
    }
  }

  // GET /motos
  try {
    const r = await axios.get(`${BASE}/motos`, { timeout: 5000 });
    results.push({ endpoint: '/motos', ok: true, status: r.status, length: Array.isArray(r.data) ? r.data.length : undefined });
  } catch (err) {
    results.push({ endpoint: '/motos', ok: false, message: err.message });
  }

  // GET /filiais
  try {
    const r = await axios.get(`${BASE}/filiais`, { timeout: 5000 });
    results.push({ endpoint: '/filiais', ok: true, status: r.status, length: Array.isArray(r.data) ? r.data.length : undefined });
  } catch (err) {
    results.push({ endpoint: '/filiais', ok: false, message: err.message });
  }

  // GET /iot/status
  try {
    const r = await axios.get(`${BASE}/iot/status`, { timeout: 5000 });
    results.push({ endpoint: '/iot/status', ok: true, status: r.status });
  } catch (err) {
    results.push({ endpoint: '/iot/status', ok: false, message: err.message });
  }

  console.log('Smoke test results:');
  results.forEach((r) => console.log(JSON.stringify(r)));
}

run().catch((e) => {
  console.error('Smoke test error', e);
  process.exit(1);
});
