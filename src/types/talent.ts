/**
 * Talent facet — Builder & Creator credibility.
 * "Evidence of building and creating over time"
 *
 * FORBIDDEN (per Phase 1 & 2):
 * - ranking
 * - undocumented scorer variants (e.g., builder_score_2025)
 *
 * Per Phase 2:
 * - Builder and Creator are parallel axes of credibility
 * - Both scores are optional (wallet may have one, both, or neither)
 */

import type { BaseCredLevel } from './level.js';

export interface TalentData {
  builderScore: number;
  builderLevel?: BaseCredLevel;   // Optional: derived when levels.enabled
  creatorScore?: number;          // Optional: present when creator_score exists
  creatorLevel?: BaseCredLevel;   // Optional: derived when levels.enabled
}

export interface TalentSignals {
  verifiedBuilder: boolean;
  verifiedCreator?: boolean;      // Optional: true when creatorScore > 0
}

export interface TalentMeta {
  lastUpdatedAt: string | null;    // ISO 8601 or null if unknown
}

export interface TalentFacet {
  data: TalentData;
  signals: TalentSignals;
  meta: TalentMeta;
}
