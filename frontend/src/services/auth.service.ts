import { api } from './api';

export const authService = {
  requestRegisterCode: async (payload: { email: string }) =>
    (await api.post('/auth/register/request-code', payload)).data,
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    verificationCode: string;
  }) => (await api.post('/auth/register', payload)).data,
  supabaseRegister: async (payload: { name: string; accessToken: string }) =>
    (await api.post('/auth/supabase/register', payload)).data,
  login: async (payload: { email: string; password: string }) =>
    (await api.post('/auth/login', payload)).data,
  supabaseLogin: async (payload: { accessToken: string }) =>
    (await api.post('/auth/supabase/login', payload)).data,
  me: async () => (await api.get('/auth/me')).data,
  logout: async () => (await api.post('/auth/logout')).data,
  updateProfile: async (payload: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => (await api.patch('/users/me', payload)).data,
};
