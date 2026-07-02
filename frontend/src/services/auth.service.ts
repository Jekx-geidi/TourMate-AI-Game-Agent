import { api } from './api';

export const authService = {
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => (await api.post('/auth/register', payload)).data,
  login: async (payload: { email: string; password: string }) =>
    (await api.post('/auth/login', payload)).data,
  me: async () => (await api.get('/auth/me')).data,
  logout: async () => (await api.post('/auth/logout')).data,
};

