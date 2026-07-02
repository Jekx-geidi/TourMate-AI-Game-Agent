import { api } from './api';

export const agentService = {
  status: async () => (await api.get('/agent/status')).data,
};

