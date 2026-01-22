/**
 * Ethos facet — Social credibility.
 * "How others relate to this person"
 *
 * FORBIDDEN fields (per Phase 1):
 * - influenceFactor
 * - XP
 * - percentile
 * - ranking
 */

export interface EthosReviews {
  positive: number;
  neutral: number;
  negative: number;
}

export interface EthosData {
  score: number;
  vouchesReceived: number;
  reviews: EthosReviews;
}

export interface EthosSignals {
  hasNegativeReviews: boolean;
  hasVouches: boolean;
}

export interface EthosMeta {
  firstSeenAt: string | null;      // ISO 8601 or null if unknown
  lastUpdatedAt: string | null;    // ISO 8601 or null if unknown
  activeSinceDays: number | null;  // null if cannot compute
}

export interface EthosFacet {
  data: EthosData;
  signals: EthosSignals;
  meta: EthosMeta;
}
