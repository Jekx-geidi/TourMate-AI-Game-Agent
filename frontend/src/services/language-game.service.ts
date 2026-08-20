import { api } from './api';
import type {
  AnswerResult,
  LanguageGameMode,
  NextWord,
  SupportedLanguageCode,
} from '../types/language-game';

export const languageGameService = {
  getNextWord: async (
    language: SupportedLanguageCode,
    mode: LanguageGameMode,
  ): Promise<NextWord> =>
    (await api.get('/language-games/words/next', { params: { language, mode } })).data,

  submitAnswer: async (payload: {
    wordId: string;
    mode: LanguageGameMode;
    answer: string;
    requestKey: string;
  }): Promise<AnswerResult> => (await api.post('/language-games/answers', payload)).data,
};
