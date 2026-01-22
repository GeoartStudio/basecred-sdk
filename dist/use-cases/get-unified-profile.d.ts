/**
 * Unified Profile Use Case — Orchestrates facet assembly.
 *
 * Per CLAUDE.md:
 * - Use Case orchestrates repositories
 * - MUST NOT know about HTTP, headers, or framework APIs
 * - MUST NOT perform SQL, ORM, RPC, or chain calls
 *
 * Per Phase 0:
 * - No interpretation, no judgment
 * - Partial responses are valid
 * - Absence must always be explicit
 */
import type { SDKConfig } from '../types/config.js';
import type { UnifiedProfile } from '../types/unified.js';
export declare function getUnifiedProfile(address: string, config: SDKConfig): Promise<UnifiedProfile>;
//# sourceMappingURL=get-unified-profile.d.ts.map