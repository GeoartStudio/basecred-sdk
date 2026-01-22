/**
 * Ethos Repository — Data access layer for Ethos API.
 *
 * Per CLAUDE.md:
 * - Fetches and maps raw API data to domain types
 * - MUST NOT contain business rules
 * - MUST NOT perform authorization or validation
 */
import type { EthosConfig } from '../types/config.js';
import type { EthosFacet } from '../types/ethos.js';
import type { AvailabilityState } from '../types/availability.js';
export interface EthosRepositoryResult {
    availability: AvailabilityState;
    facet?: EthosFacet;
}
export declare function fetchEthosProfile(address: string, config: EthosConfig): Promise<EthosRepositoryResult>;
//# sourceMappingURL=ethos.repository.d.ts.map