/**
 * UnifiedProfile — The locked Phase 0 schema.
 * This is THE product.
 *
 * Rules:
 * - Partial responses are valid (ethos/talent may be absent)
 * - Absence must always be explicit via availability
 * - Silent defaults are forbidden
 */
import type { Identity } from './identity.js';
import type { Availability } from './availability.js';
import type { EthosFacet } from './ethos.js';
import type { TalentFacet } from './talent.js';
export interface UnifiedProfile {
    identity: Identity;
    availability: Availability;
    ethos?: EthosFacet;
    talent?: TalentFacet;
}
//# sourceMappingURL=unified.d.ts.map