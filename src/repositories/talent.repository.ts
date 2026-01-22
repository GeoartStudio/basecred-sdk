/**
 * Talent Repository — Data access layer for Talent Protocol API.
 *
 * Per CLAUDE.md:
 * - Fetches and maps raw API data to domain types
 * - MUST NOT contain business rules
 * - MUST NOT perform authorization or validation
 *
 * Per Phase 2 spec:
 * - Uses /scores endpoint to fetch all scores
 * - Maps builder_score → builderScore
 * - Maps creator_score → creatorScore
 * - Ignores undocumented scores (e.g., builder_score_2025)
 * - verifiedBuilder = builderScore > 0
 * - verifiedCreator = creatorScore > 0
 */

import type { TalentConfig } from '../types/config.js';
import type { TalentFacet, TalentData, TalentSignals } from '../types/talent.js';
import type { AvailabilityState } from '../types/availability.js';

// Known score slugs per Phase 2 spec
const BUILDER_SCORE_SLUG = 'builder_score';
const CREATOR_SCORE_SLUG = 'creator_score';

// Raw API response type (internal only)
interface TalentScoreItem {
  slug: string;
  points: number;
  last_calculated_at: string | null;
  // FORBIDDEN: rank_position - do not map
}

interface TalentScoresResponse {
  scores: TalentScoreItem[];
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
    // Phase 2: Use /scores endpoint to fetch all scores
    const url = `${config.baseUrl}/scores?id=${address}&account_source=wallet`;

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

    const data = (await response.json()) as TalentScoresResponse;

    if (!data || !data.scores || data.scores.length === 0) {
      return { availability: 'not_found' };
    }

    // Filter and map known scores only
    const builderScoreItem = data.scores.find(s => s.slug === BUILDER_SCORE_SLUG);
    const creatorScoreItem = data.scores.find(s => s.slug === CREATOR_SCORE_SLUG);

    // If neither known score exists, treat as not found
    if (!builderScoreItem && !creatorScoreItem) {
      return { availability: 'not_found' };
    }

    // Build data object with available scores
    const talentData: TalentData = {
      builderScore: builderScoreItem?.points ?? 0,
      ...(creatorScoreItem ? { creatorScore: creatorScoreItem.points } : {}),
    };

    // Build signals object
    const talentSignals: TalentSignals = {
      verifiedBuilder: (builderScoreItem?.points ?? 0) > 0,
      ...(creatorScoreItem ? { verifiedCreator: creatorScoreItem.points > 0 } : {}),
    };

    // Use most recent last_calculated_at from available scores
    const lastUpdatedAt = builderScoreItem?.last_calculated_at
      ?? creatorScoreItem?.last_calculated_at
      ?? null;

    const facet: TalentFacet = {
      data: talentData,
      signals: talentSignals,
      meta: {
        lastUpdatedAt,
      },
    };

    return { availability: 'available', facet };
  } catch {
    return { availability: 'error' };
  }
}
