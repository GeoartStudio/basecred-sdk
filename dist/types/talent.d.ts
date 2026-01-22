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
    builderLevel?: BaseCredLevel;
    creatorScore?: number;
    creatorLevel?: BaseCredLevel;
}
export interface TalentSignals {
    verifiedBuilder: boolean;
    verifiedCreator?: boolean;
}
export interface TalentMeta {
    lastUpdatedAt: string | null;
}
export interface TalentFacet {
    data: TalentData;
    signals: TalentSignals;
    meta: TalentMeta;
}
//# sourceMappingURL=talent.d.ts.map