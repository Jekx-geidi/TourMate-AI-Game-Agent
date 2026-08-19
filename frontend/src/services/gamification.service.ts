import { api } from './api';
import type { GamificationProfile } from '../types';

export const gamificationService = {
  me: async () => (await api.get<GamificationProfile>('/gamification/me')).data,
};
