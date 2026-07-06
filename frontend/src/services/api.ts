import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const api = axios.create({
  // Use an explicit frontend env override when provided, otherwise rely on
  // same-origin /api so Vite dev proxy and production rewrites both work.
  baseURL: configuredBaseUrl && configuredBaseUrl.length > 0 ? configuredBaseUrl : '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tourmate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
