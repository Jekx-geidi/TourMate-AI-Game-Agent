import { api } from './api';

export const subjectsService = {
  list: async () => (await api.get('/subjects')).data,
  get: async (id: string) => (await api.get(`/subjects/${id}`)).data,
  lessons: async (id: string) => (await api.get(`/subjects/${id}/lessons`)).data,
};

