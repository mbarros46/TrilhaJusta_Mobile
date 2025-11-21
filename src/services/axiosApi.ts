import axios from 'axios';
import { apiConfig } from './api';

const client = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout ?? 10000,
  headers: apiConfig.headers,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

// If developer provided a static token via env (EXPO_PUBLIC_API_TOKEN), use it by default
if (typeof process !== 'undefined' && process?.env?.EXPO_PUBLIC_API_TOKEN) {
  client.defaults.headers.common.Authorization = `Bearer ${process.env.EXPO_PUBLIC_API_TOKEN}`;
}

export default client;
