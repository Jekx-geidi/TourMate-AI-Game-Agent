import { api } from './api';
import type { GamificationProfile, Leaderboard } from '../types';

export const gamificationService = {
  me: async () => (await api.get<GamificationProfile>('/gamification/me')).data,
  leaderboard: async () => (await api.get<Leaderboard>('/gamification/leaderboard')).data,
};
