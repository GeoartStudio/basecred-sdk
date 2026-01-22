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
export interface TalentRepositoryResult {
    availability: AvailabilityState;
    facet?: TalentFacet;
}
export declare function fetchTalentScore(address: string, config: TalentConfig): Promise<TalentRepositoryResult>;
//# sourceMappingURL=talent.repository.d.ts.map