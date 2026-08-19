import { api } from './api';
import type {
  SimulationDetail,
  SimulationListResponse,
  SimulationResultResponse,
  SimulationSessionView,
  SubmitAnswerResponse,
} from '../types';

// Idempotency keys must stay stable across retries of the SAME user action
// (a dropped response retried, a "Retry" click) and only change for a
// genuinely new action -- see docs/TDD.md section 18.3. Callers that need
// retry safety should generate one key (e.g. via useRef) and pass it in on
// every attempt of that action; the default here covers simple one-shot calls.
export function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const simulationsService = {
  list: async (subjectId?: string) =>
    (
      await api.get<SimulationListResponse>('/simulations', {
        params: subjectId ? { subjectId } : undefined,
      })
    ).data,

  getBySlug: async (slug: string) =>
    (await api.get<SimulationDetail>(`/simulations/${slug}`)).data,

  start: async (slug: string, idempotencyKey: string = newIdempotencyKey()) =>
    (
      await api.post<SimulationSessionView>(
        `/simulations/${slug}/sessions`,
        {},
        { headers: { 'Idempotency-Key': idempotencyKey } },
      )
    ).data,

  getSession: async (sessionId: string) =>
    (await api.get<SimulationSessionView>(`/simulation-sessions/${sessionId}`)).data,

  submitAnswer: async (
    sessionId: string,
    stepId: string,
    optionId: string,
    idempotencyKey: string = newIdempotencyKey(),
  ) =>
    (
      await api.post<SubmitAnswerResponse>(
        `/simulation-sessions/${sessionId}/answers`,
        { stepId, optionId },
        { headers: { 'Idempotency-Key': idempotencyKey } },
      )
    ).data,

  complete: async (sessionId: string, idempotencyKey: string = newIdempotencyKey()) =>
    (
      await api.post<SimulationResultResponse>(
        `/simulation-sessions/${sessionId}/complete`,
        {},
        { headers: { 'Idempotency-Key': idempotencyKey } },
      )
    ).data,

  getResult: async (sessionId: string) =>
    (await api.get<SimulationResultResponse>(`/simulation-sessions/${sessionId}/result`)).data,
};
