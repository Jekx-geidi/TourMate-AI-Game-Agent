import { api } from './api';

export const aiService = {
  chat: async (payload: { message: string; subjectCode?: string; subjectId?: string }) =>
    (await api.post('/ai/chat', payload)).data,
  generateNotes: async (payload: { prompt: string; subjectCode?: string }) =>
    (await api.post('/ai/generate-notes', payload)).data,
  generateFlashcards: async (payload: { prompt: string; subjectCode?: string }) =>
    (await api.post('/ai/generate-flashcards', payload)).data,
  generateQuiz: async (payload: { prompt: string; subjectCode?: string }) =>
    (await api.post('/ai/generate-quiz', payload)).data,
  studyPlan: async (payload: { prompt: string; subjectCode?: string }) =>
    (await api.post('/ai/study-plan', payload)).data,
};

