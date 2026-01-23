/**
 * Unified Profile Use Case — Orchestrates facet assembly.
 */

import type { SDKConfig } from '../types/config.js';
import type { UnifiedProfile, Recency, RecencyBucket } from '../types/unified.js';
import type { Availability } from '../types/availability.js';
import type { EthosFacet } from '../types/ethos.js';
import type { TalentFacet } from '../types/talent.js';
import { fetchEthosProfile, type EthosRepositoryResult } from '../repositories/ethos.repository.js';
import { fetchTalentScore, type TalentRepositoryResult } from '../repositories/talent.repository.js';
import { deriveEthosCredibilityLevel, deriveBuilderLevel, deriveCreatorLevel } from '../levels/index.js';

// ─── Time Constants ───────────────────────────────────────────────────────────
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const RECENCY_WINDOW_DAYS = 30;

// ─── Time Helpers ─────────────────────────────────────────────────────────────

/**
 * Compute days elapsed since a timestamp (floor, UTC only).
 * Returns null if timestamp is missing, 0 if timestamp is in the future.
 */
function computeDaysAgo(isoTimestamp: string | null): number | null {
  if (!isoTimestamp) return null;
  const then = new Date(isoTimestamp).getTime();
  const now = Date.now();
  if (then > now) return 0; // Future timestamp
  return Math.floor((now - then) / ONE_DAY_MS);
}

/**
 * Derive recency bucket from days ago using fixed window policy.
 * - recent: ≤ windowDays
 * - stale: windowDays < days ≤ windowDays × 3
 * - dormant: > windowDays × 3
 */
function computeRecencyBucket(daysAgo: number): RecencyBucket {
  if (daysAgo <= RECENCY_WINDOW_DAYS) return 'recent';
  if (daysAgo <= RECENCY_WINDOW_DAYS * 3) return 'stale';
  return 'dormant';
}

/**
 * Compute profile-level recency from facet timestamps.
 * Uses the most recent (min daysAgo) available timestamp.
 * Returns undefined if no facet has lastUpdatedAt.
 */
function computeRecency(
  ethos: EthosFacet | undefined,
  talent: TalentFacet | undefined
): Recency | undefined {
  const sources: { source: 'ethos' | 'talent'; daysAgo: number }[] = [];

  if (ethos?.meta.lastUpdatedDaysAgo !== null && ethos?.meta.lastUpdatedDaysAgo !== undefined) {
    sources.push({ source: 'ethos', daysAgo: ethos.meta.lastUpdatedDaysAgo });
  }
  if (talent?.meta.lastUpdatedDaysAgo !== null && talent?.meta.lastUpdatedDaysAgo !== undefined) {
    sources.push({ source: 'talent', daysAgo: talent.meta.lastUpdatedDaysAgo });
  }

  // If no sources have timestamps, omit recency
  if (sources.length === 0) return undefined;

  // Use the most recent (smallest daysAgo) for bucket determination
  const minDaysAgo = Math.min(...sources.map(s => s.daysAgo));
  const derivedFrom = sources.map(s => s.source);

  return {
    bucket: computeRecencyBucket(minDaysAgo),
    windowDays: RECENCY_WINDOW_DAYS,
    lastUpdatedDaysAgo: minDaysAgo,
    derivedFrom,
    computedAt: new Date().toISOString(),
    policy: 'recency@v1',
  };
}

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
  const ethosWithLevels = ethosResult.availability === 'available' && ethosResult.facet
    ? applyEthosLevel(ethosResult.facet, config)
    : undefined;

  const talentWithLevels = talentResult.availability === 'available' && talentResult.facet
    ? applyTalentLevel(talentResult.facet, config)
    : undefined;

  // Apply time calculations to facets
  const ethosFacet = ethosWithLevels
    ? {
        ...ethosWithLevels,
        meta: {
          ...ethosWithLevels.meta,
          activeSinceDays: computeDaysAgo(ethosWithLevels.meta.firstSeenAt),
          lastUpdatedDaysAgo: computeDaysAgo(ethosWithLevels.meta.lastUpdatedAt),
        },
      }
    : undefined;

  const talentFacet = talentWithLevels
    ? {
        ...talentWithLevels,
        meta: {
          ...talentWithLevels.meta,
          lastUpdatedDaysAgo: computeDaysAgo(talentWithLevels.meta.lastUpdatedAt),
        },
      }
    : undefined;

  // Compute profile-level recency from facet timestamps
  const recency = computeRecency(ethosFacet, talentFacet);

  // Assemble unified profile — facets included only when available
  const profile: UnifiedProfile = {
    identity: {
      address,
    },
    availability,
    // Conditional inclusion: property exists only when available
    ...(ethosFacet ? { ethos: ethosFacet } : {}),
    ...(talentFacet ? { talent: talentFacet } : {}),
    ...(recency ? { recency } : {}),
  };

  return profile;
}
