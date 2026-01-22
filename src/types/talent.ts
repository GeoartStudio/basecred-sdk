/**
 * Talent facet — Builder credibility.
 * "Evidence of building over time"
 *
 * FORBIDDEN (per Phase 1):
 * - ranking
 * - scorer variants
 */

export interface TalentData {
  builderScore: number;
}

export interface TalentSignals {
  verifiedBuilder: boolean;
}

export interface TalentMeta {
  lastUpdatedAt: string | null;    // ISO 8601 or null if unknown
}

export interface TalentFacet {
  data: TalentData;
  signals: TalentSignals;
  meta: TalentMeta;
}
