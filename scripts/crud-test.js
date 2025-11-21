const axios = require('axios');

const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8085';

async function run() {
  console.log('CRUD test base URL:', BASE);
  console.log('Attempting to obtain auth (token or session cookie)');
  let cookieHeader = null;
  let obtainedToken = null;
  if (!process.env.EXPO_PUBLIC_API_TOKEN) {
    // First try JSON login that returns { token }
    try {
      console.log('Trying JSON login at /auth/login');
      const loginJson = await axios.post(`${BASE}/auth/login`, { email: 'test@example.com', senha: '123456' }, { headers: { 'Content-Type': 'application/json' }, timeout: 5000 });
      if (loginJson && loginJson.data && (loginJson.data.token || loginJson.data.accessToken)) {
        obtainedToken = loginJson.data.token || loginJson.data.accessToken;
        console.log('Obtained JWT token from JSON /auth/login');
      }
    } catch (err) {
      // ignore, fallback to form-login below
    }

    try {
      // Try form login to obtain session cookie (for servers using form-based auth)
      const form = new URLSearchParams({ username: 'test@example.com', email: 'test@example.com', senha: '123456' }).toString();
      const loginResp = await axios.post(`${BASE}/login`, form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000, maxRedirects: 0 });
      // If it returns 2xx with cookies
      const setCookie = loginResp.headers && (loginResp.headers['set-cookie'] || loginResp.headers['Set-Cookie']);
      if (setCookie) {
        // join cookie parts
        cookieHeader = Array.isArray(setCookie) ? setCookie.map((c) => c.split(';')[0]).join('; ') : String(setCookie).split(';')[0];
        console.log('Obtained session cookie from /login');
      }
    } catch (err) {
      // If server responded with redirect, headers might be in err.response
      const resp = err.response;
      if (resp && resp.headers) {
        const setCookie = resp.headers['set-cookie'] || resp.headers['Set-Cookie'];
        if (setCookie) {
          cookieHeader = Array.isArray(setCookie) ? setCookie.map((c) => c.split(';')[0]).join('; ') : String(setCookie).split(';')[0];
          console.log('Obtained session cookie from redirect response');
        } else {
          console.warn('Login redirected; no set-cookie found in response headers. Location:', resp.headers.location || resp.headers.Location);
        }
      } else {
        console.warn('Form login attempt failed:', err.message || err);
      }
    }
  }

  // prepare common headers for subsequent requests (token or cookie)
  const commonHeaders = {};
  // Priority: EXPO_PUBLIC_API_TOKEN env > obtainedToken from /auth/login JSON > session cookie
  if (process.env.EXPO_PUBLIC_API_TOKEN) {
    commonHeaders.Authorization = `Bearer ${process.env.EXPO_PUBLIC_API_TOKEN}`;
  } else if (obtainedToken) {
    commonHeaders.Authorization = `Bearer ${obtainedToken}`;
  } else if (cookieHeader) {
    commonHeaders.Cookie = cookieHeader;
  }

  // If we have a session cookie but no Authorization token, try to obtain CSRF token
  if (!commonHeaders.Authorization && cookieHeader) {
    try {
      // Many Spring apps expose /csrf returning JSON { _csrf: { token, parameterName, headerName } }
      const r = await axios.get(`${BASE}/csrf`, { headers: { Cookie: cookieHeader }, timeout: 3000 });
      const token = (r.data && (r.data._csrf?.token || r.data.token)) || null;
      if (token) {
        // Default header name is X-CSRF-TOKEN or as provided
        const headerName = (r.data && r.data._csrf && r.data._csrf.headerName) || 'X-CSRF-TOKEN';
        commonHeaders[headerName] = token;
        console.log('Obtained CSRF token from /csrf and set header', headerName);
      } else {
        // Some apps expose token as cookie XSRF-TOKEN — try to parse it from cookieHeader
        const xsrf = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith('XSRF-TOKEN='));
        if (xsrf) {
          const val = xsrf.split('=')[1];
          commonHeaders['X-XSRF-TOKEN'] = val;
          console.log('Parsed XSRF-TOKEN from cookie and set X-XSRF-TOKEN header');
        }
      }
    } catch (err) {
      // ignore — server may not expose /csrf endpoint
    }
  }

  // 1) Create
  const payload = { modelo: 'Teste CI', placa: 'TST-0001', status: 'Disponível' };
  let created;
  try {
    const r = await axios.post(`${BASE}/motos`, payload, { timeout: 5000, headers: commonHeaders, maxRedirects: 0 });
    console.log('Create status:', r.status);
    created = r.data;
    console.log('Created:', created);
  } catch (err) {
    const resp = err.response;
    if (resp) {
      console.error('Create failed, status:', resp.status, 'headers:', resp.headers);
    } else {
      console.error('Create failed:', err.message || err);
    }
    return process.exitCode = 1;
  }

  const id = created?.id ?? created?.ID ?? created?.codigo ?? null;
  if (!id) {
    console.warn('Could not determine created id from response, attempt to fetch by plate');
    try {
    const list = await axios.get(`${BASE}/motos`, { timeout: 5000, headers: commonHeaders });
      const found = list.data.find((m) => (m.placa || '').toLowerCase() === payload.placa.toLowerCase());
      if (found) {
        console.log('Found created by plate, id=', found.id);
        created = found;
      } else {
        console.error('Created moto not found in list');
        return process.exitCode = 1;
      }
    } catch (err) {
      console.error('List failed:', err.message || err);
      return process.exitCode = 1;
    }
  }

  const realId = created.id ?? created.ID ?? created.codigo;

  // 2) Get
  try {
  const r = await axios.get(`${BASE}/motos/${realId}`, { timeout: 5000, headers: commonHeaders });
    console.log('Get status:', r.status, 'data:', r.data);
  } catch (err) {
    console.error('Get failed:', err.message || err);
    return process.exitCode = 1;
  }

  // 3) Update
  try {
  const r = await axios.put(`${BASE}/motos/${realId}`, { modelo: 'Teste CI Atualizado', placa: payload.placa, status: 'Em manutenção' }, { timeout: 5000, headers: commonHeaders });
    console.log('Update status:', r.status, 'data:', r.data);
  } catch (err) {
    console.error('Update failed:', err.message || err);
    return process.exitCode = 1;
  }

  // 4) Delete
  try {
  const r = await axios.delete(`${BASE}/motos/${realId}`, { timeout: 5000, headers: commonHeaders });
    console.log('Delete status:', r.status);
  } catch (err) {
    console.error('Delete failed:', err.message || err);
    return process.exitCode = 1;
  }

  console.log('CRUD test finished successfully');
}

run().catch((e) => {
  console.error('Unexpected error', e);
  process.exitCode = 1;
});
