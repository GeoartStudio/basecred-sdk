/**
 * Internal types for level policies.
 *
 * Per BASECRED_TIER.md:
 * - Policies are immutable once released
 * - Changes require a new version
 */
export interface LevelThreshold {
    min: number;
    max: number;
    label: string;
}
export interface LevelPolicy {
    id: string;
    thresholds: LevelThreshold[];
}
//# sourceMappingURL=types.d.ts.map