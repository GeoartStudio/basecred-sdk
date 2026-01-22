/**
 * Talent Repository — Data access layer for Talent Protocol API.
 *
 * Per CLAUDE.md:
 * - Fetches and maps raw API data to domain types
 * - MUST NOT contain business rules
 * - MUST NOT perform authorization or validation
 *
 * Per Phase 1 spec:
 * - builderScore = points
 * - verifiedBuilder = points > 0
 * - Ignore ranking and scorer variants
 */
export async function fetchTalentScore(address, config) {
    try {
        const url = `${config.baseUrl}/score?id=${address}&account_source=wallet`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': config.apiKey,
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            return { availability: 'error' };
        }
        const data = (await response.json());
        if (!data || !data.score) {
            return { availability: 'not_found' };
        }
        const points = data.score.points;
        const facet = {
            data: {
                builderScore: points,
            },
            signals: {
                verifiedBuilder: points > 0,
            },
            meta: {
                lastUpdatedAt: data.score.last_calculated_at ?? null,
            },
        };
        return { availability: 'available', facet };
    }
    catch {
        return { availability: 'error' };
    }
}
