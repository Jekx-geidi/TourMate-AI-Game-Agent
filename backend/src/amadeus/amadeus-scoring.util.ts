import { AmadeusTier, AMADEUS_TIER_XP_MULTIPLIER } from './amadeus.constants';

export function normalizeCommand(value: string): string {
  return value.normalize('NFKC').trim().toUpperCase().replace(/\s+/g, ' ');
}

export interface ScoredCommand {
  tier: AmadeusTier;
  tierXpMultiplier: number;
  matchedSlots: number;
  totalSlots: number;
  missingSlotHintIndexes: number[];
}

/**
 * Each entry in `requiredTokenGroups` is one required "slot" in the
 * command (e.g. the origin airport code) with one or more accepted
 * synonyms/phrasings. A slot is satisfied if any of its variants appears
 * in the normalized command. Tier follows how many slots were satisfied,
 * matching docs section 17's "Simple" scoring (first-attempt-correct ->
 * Perfect, correct-after-hint -> Great, retries -> Close, unable -> Almost).
 */
export function scoreCommand(rawCommand: string, requiredTokenGroups: string[][]): ScoredCommand {
  const normalized = normalizeCommand(rawCommand);
  const totalSlots = requiredTokenGroups.length;

  const missingSlotHintIndexes: number[] = [];
  let matchedSlots = 0;

  requiredTokenGroups.forEach((variants, index) => {
    const satisfied = variants.some((variant) => normalized.includes(normalizeCommand(variant)));
    if (satisfied) {
      matchedSlots += 1;
    } else {
      missingSlotHintIndexes.push(index);
    }
  });

  const ratio = totalSlots === 0 ? 1 : matchedSlots / totalSlots;

  let tier: AmadeusTier;
  if (normalized.length === 0) {
    tier = 'WRONG';
  } else if (ratio === 1) {
    tier = 'PERFECT';
  } else if (ratio >= 0.75) {
    tier = 'GREAT';
  } else if (ratio >= 0.5) {
    tier = 'CLOSE';
  } else if (ratio > 0) {
    tier = 'ALMOST';
  } else {
    tier = 'WRONG';
  }

  return {
    tier,
    tierXpMultiplier: AMADEUS_TIER_XP_MULTIPLIER[tier],
    matchedSlots,
    totalSlots,
    missingSlotHintIndexes,
  };
}
