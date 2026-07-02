import { api } from './api';

export const notesService = {
  list: async (params?: { subjectId?: string; search?: string }) =>
    (
      await api.get('/notes', {
        params,
      })
    ).data,
  create: async (payload: { subjectId: string; title: string; content: string }) =>
    (await api.post('/notes', payload)).data,
  update: async (
    id: string,
    payload: Partial<{ subjectId: string; title: string; content: string }>,
  ) => (await api.put(`/notes/${id}`, payload)).data,
  remove: async (id: string) => (await api.delete(`/notes/${id}`)).data,
};

