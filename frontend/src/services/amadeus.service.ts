import { api } from './api';
import type { AmadeusCommandResult, AmadeusScenarioSummary, AmadeusSession } from '../types/amadeus';

export const amadeusService = {
  listScenarios: async (): Promise<AmadeusScenarioSummary[]> =>
    (await api.get('/amadeus/scenarios')).data,

  startSession: async (slug: string, idempotencyKey: string): Promise<AmadeusSession> =>
    (
      await api.post(
        `/amadeus/scenarios/${slug}/sessions`,
        {},
        { headers: { 'Idempotency-Key': idempotencyKey } },
      )
    ).data,

  getSession: async (sessionId: string): Promise<AmadeusSession> =>
    (await api.get(`/amadeus/sessions/${sessionId}`)).data,

  submitCommand: async (
    sessionId: string,
    payload: { command: string; requestKey: string },
  ): Promise<AmadeusCommandResult> =>
    (await api.post(`/amadeus/sessions/${sessionId}/commands`, payload)).data,
};
