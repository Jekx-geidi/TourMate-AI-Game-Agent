import { api } from './api';

export const quizzesService = {
  bySubject: async (subjectId: string) =>
    (await api.get(`/quizzes/subject/${subjectId}`)).data,
  submit: async (
    quizId: string,
    payload: { subjectId: string; answers: Array<{ questionId: string; answer: string }> },
  ) => (await api.post(`/quizzes/${quizId}/submit`, payload)).data,
};

