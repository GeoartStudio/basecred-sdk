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
 *
 * Per BASECRED_TIER.md:
 * - Level derivation is enabled by default
 * - Levels are applied after score assembly
 */

import type { SDKConfig } from '../types/config.js';
import type { UnifiedProfile } from '../types/unified.js';
import type { Availability } from '../types/availability.js';
import type { EthosFacet } from '../types/ethos.js';
import type { TalentFacet } from '../types/talent.js';
import { fetchEthosProfile, type EthosRepositoryResult } from '../repositories/ethos.repository.js';
import { fetchTalentScore, type TalentRepositoryResult } from '../repositories/talent.repository.js';
import { deriveEthosCredibilityLevel, deriveBuilderLevel, deriveCreatorLevel } from '../levels/index.js';

/**
 * Check if level derivation is enabled (defaults to true).
 */
function isLevelDerivationEnabled(config: SDKConfig): boolean {
  return config.levels?.enabled !== false;
}

/**
 * Apply level derivation to Ethos facet if enabled.
 */
function applyEthosLevel(facet: EthosFacet, config: SDKConfig): EthosFacet {
  if (!isLevelDerivationEnabled(config)) {
    return facet;
  }

  const credibilityLevel = deriveEthosCredibilityLevel(facet.data.score);
  if (!credibilityLevel) {
    return facet;
  }

  return {
    ...facet,
    data: {
      ...facet.data,
      credibilityLevel,
    },
  };
}

/**
 * Apply level derivation to Talent facet if enabled.
 * Per Phase 2: Both builder and creator levels are derived when scores are present.
 */
function applyTalentLevel(facet: TalentFacet, config: SDKConfig): TalentFacet {
  if (!isLevelDerivationEnabled(config)) {
    return facet;
  }

  // Derive builder level
  const builderLevel = deriveBuilderLevel(facet.data.builderScore);

  // Derive creator level if creatorScore exists
  const creatorLevel = facet.data.creatorScore !== undefined
    ? deriveCreatorLevel(facet.data.creatorScore)
    : undefined;

  // Return facet with derived levels (only include if derivation succeeded)
  return {
    ...facet,
    data: {
      ...facet.data,
      ...(builderLevel ? { builderLevel } : {}),
      ...(creatorLevel ? { creatorLevel } : {}),
    },
  };
}

export async function getUnifiedProfile(
  address: string,
  config: SDKConfig
): Promise<UnifiedProfile> {
  // Call both repositories in parallel — one failure must not block the other
  const [ethosSettled, talentSettled] = await Promise.allSettled([
    fetchEthosProfile(address, config.ethos),
    fetchTalentScore(address, config.talent),
  ]);

  // Extract results, mapping rejected promises to error state
  const ethosResult: EthosRepositoryResult =
    ethosSettled.status === 'fulfilled'
      ? ethosSettled.value
      : { availability: 'error' };

  const talentResult: TalentRepositoryResult =
    talentSettled.status === 'fulfilled'
      ? talentSettled.value
      : { availability: 'error' };

  // Build availability block — always explicit
  const availability: Availability = {
    ethos: ethosResult.availability,
    talent: talentResult.availability,
  };

  // Apply level derivation to facets (enabled by default)
  const ethosFacet = ethosResult.availability === 'available' && ethosResult.facet
    ? applyEthosLevel(ethosResult.facet, config)
    : undefined;

  const talentFacet = talentResult.availability === 'available' && talentResult.facet
    ? applyTalentLevel(talentResult.facet, config)
    : undefined;

  // Assemble unified profile — facets included only when available
  const profile: UnifiedProfile = {
    identity: {
      address,
    },
    availability,
    // Conditional inclusion: property exists only when available
    ...(ethosFacet ? { ethos: ethosFacet } : {}),
    ...(talentFacet ? { talent: talentFacet } : {}),
  };

  return profile;
}
