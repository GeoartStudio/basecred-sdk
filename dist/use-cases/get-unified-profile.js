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
import { fetchEthosProfile } from '../repositories/ethos.repository.js';
import { fetchTalentScore } from '../repositories/talent.repository.js';
export async function getUnifiedProfile(address, config) {
    // Call both repositories in parallel — one failure must not block the other
    const [ethosSettled, talentSettled] = await Promise.allSettled([
        fetchEthosProfile(address, config.ethos),
        fetchTalentScore(address, config.talent),
    ]);
    // Extract results, mapping rejected promises to error state
    const ethosResult = ethosSettled.status === 'fulfilled'
        ? ethosSettled.value
        : { availability: 'error' };
    const talentResult = talentSettled.status === 'fulfilled'
        ? talentSettled.value
        : { availability: 'error' };
    // Build availability block — always explicit
    const availability = {
        ethos: ethosResult.availability,
        talent: talentResult.availability,
    };
    // Assemble unified profile — facets included only when available
    const profile = {
        identity: {
            address,
        },
        availability,
        // Conditional inclusion: property exists only when available
        ...(ethosResult.availability === 'available' && ethosResult.facet
            ? { ethos: ethosResult.facet }
            : {}),
        ...(talentResult.availability === 'available' && talentResult.facet
            ? { talent: talentResult.facet }
            : {}),
    };
    return profile;
}
