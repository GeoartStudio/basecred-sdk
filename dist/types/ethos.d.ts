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
    firstSeenAt: string | null;
    lastUpdatedAt: string | null;
    activeSinceDays: number | null;
}
export interface EthosFacet {
    data: EthosData;
    signals: EthosSignals;
    meta: EthosMeta;
}
//# sourceMappingURL=ethos.d.ts.map