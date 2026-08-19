import { api } from './api';

export const authService = {
  requestRegisterCode: async (payload: { email: string }) =>
    (await api.post('/auth/register/request-code', payload)).data,
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
  }) => (await api.post('/auth/register', payload)).data,
  login: async (payload: { email: string; password: string }) =>
    (await api.post('/auth/login', payload)).data,
  continueWithSupabase: async (accessToken: string) =>
    (await api.post('/auth/supabase/continue', { accessToken })).data,
  me: async () => (await api.get('/auth/me')).data,
  logout: async () => (await api.post('/auth/logout')).data,
  updateProfile: async (payload: {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
    currentPassword?: string;
    newPassword?: string;
  }) => (await api.patch('/users/me', payload)).data,
};
