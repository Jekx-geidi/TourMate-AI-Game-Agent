import { Injectable } from '@nestjs/common';
import { calculateSimulationScore } from './simulation-scoring.util';
import type { ScoringInput, ScoringResult } from './simulation.types';

@Injectable()
export class SimulationScoringService {
  calculate(input: ScoringInput): ScoringResult {
    return calculateSimulationScore(input);
  }
}
