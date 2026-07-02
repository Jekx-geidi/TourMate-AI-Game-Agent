import { api } from './api';

export const progressService = {
  summary: async () => (await api.get('/progress/summary')).data,
  update: async (payload: { subjectId: string; category: string; percent: number }) =>
    (await api.post('/progress/update', payload)).data,
};

