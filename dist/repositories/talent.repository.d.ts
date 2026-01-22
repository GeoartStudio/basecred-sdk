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
import type { TalentFacet } from '../types/talent.js';
import type { AvailabilityState } from '../types/availability.js';
export interface TalentRepositoryResult {
    availability: AvailabilityState;
    facet?: TalentFacet;
}
export declare function fetchTalentScore(address: string, config: TalentConfig): Promise<TalentRepositoryResult>;
//# sourceMappingURL=talent.repository.d.ts.map