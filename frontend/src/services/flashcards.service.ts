import { api } from './api';

export const flashcardsService = {
  bySubject: async (subjectId: string) =>
    (await api.get(`/flashcards/subject/${subjectId}`)).data,
};

