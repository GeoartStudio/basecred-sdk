/**
 * Talent Repository — Data access layer for Talent Protocol API.
 *
 * Per CLAUDE.md:
 * - Fetches and maps raw API data to domain types
 * - MUST NOT contain business rules
 * - MUST NOT perform authorization or validation
 *
 * Per Phase 1 spec:
 * - builderScore = points
 * - verifiedBuilder = points > 0
 * - Ignore ranking and scorer variants
 */

import type { TalentConfig } from '../types/config.js';
import type { TalentFacet } from '../types/talent.js';
import type { AvailabilityState } from '../types/availability.js';

// Raw API response type (internal only)
// Note: rank_position and slug are present but FORBIDDEN per Phase 1
interface TalentScoreResponse {
  score: {
    points: number;
    last_calculated_at: string | null;
    // FORBIDDEN: rank_position, slug - do not map
  };
}

// Repository result type
export interface TalentRepositoryResult {
  availability: AvailabilityState;
  facet?: TalentFacet;
}

export async function fetchTalentScore(
  address: string,
  config: TalentConfig
): Promise<TalentRepositoryResult> {
  try {
    const url = `${config.baseUrl}/score?id=${address}&account_source=wallet`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': config.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return { availability: 'error' };
    }

    const data = (await response.json()) as TalentScoreResponse;

    if (!data || !data.score) {
      return { availability: 'not_found' };
    }

    const points = data.score.points;

    const facet: TalentFacet = {
      data: {
        builderScore: points,
      },
      signals: {
        verifiedBuilder: points > 0,
      },
      meta: {
        lastUpdatedAt: data.score.last_calculated_at ?? null,
      },
    };

    return { availability: 'available', facet };
  } catch {
    return { availability: 'error' };
  }
}
