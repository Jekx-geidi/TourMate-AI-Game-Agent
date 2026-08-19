import type { ConfigService } from '@nestjs/config';
import { SimulationCoachService } from './simulation-coach.service';
import type { CoachRequestParams } from './simulation-coach.service';

function fakeConfig(values: Record<string, string | undefined>): ConfigService {
  return { get: (key: string) => values[key] } as unknown as ConfigService;
}

const BASE_PARAMS: CoachRequestParams = {
  missionTitle: 'Delayed Flight Passenger Assistance',
  role: 'Airport customer-service trainee',
  overallScore: 82,
  categoryScores: {
    communication: 90,
    'service-recovery': 80,
    'safety-policy-awareness': 75,
    'problem-solving': 80,
    professionalism: 90,
  },
  deterministicFeedback: {
    summary: 'Solid overall performance.',
    strengths: [
      {
        competency: 'communication',
        evidence: 'Acknowledged the concern calmly.',
      },
    ],
    improvements: [
      {
        competency: 'safety-policy-awareness',
        suggestion: 'Double-check policy before promising an outcome.',
      },
    ],
    nextAction: {
      type: 'REPLAY',
      label: 'Replay this mission to improve your weakest area',
    },
  },
};

describe('SimulationCoachService', () => {
  it('falls back to the deterministic result when no provider key is configured', async () => {
    const service = new SimulationCoachService(fakeConfig({}));
    const outcome = await service.generateCoachFeedback(BASE_PARAMS);

    expect(outcome.source).toBe('DETERMINISTIC_FALLBACK');
    expect(outcome.providerId).toBeNull();
    expect(outcome.content.summary).toBe(
      BASE_PARAMS.deterministicFeedback.summary,
    );
    expect(outcome.content.nextAction).toBe(
      BASE_PARAMS.deterministicFeedback.nextAction.label,
    );
  });
});
