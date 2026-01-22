/**
 * Ethos Repository — Data access layer for Ethos API.
 *
 * Per CLAUDE.md:
 * - Fetches and maps raw API data to domain types
 * - MUST NOT contain business rules
 * - MUST NOT perform authorization or validation
 */
export async function fetchEthosProfile(address, config) {
    try {
        const response = await fetch(`${config.baseUrl}/api/v2/users/by/address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Ethos-Client': config.clientId,
            },
            body: JSON.stringify({ addresses: [address] }),
        });
        if (!response.ok) {
            return { availability: 'error' };
        }
        const data = (await response.json());
        if (!data || data.length === 0) {
            return { availability: 'not_found' };
        }
        const user = data[0];
        if (!user) {
            return { availability: 'not_found' };
        }
        const facet = {
            data: {
                score: user.score,
                vouchesReceived: user.stats.vouch.received.count,
                reviews: {
                    positive: user.stats.review.received.positive,
                    neutral: user.stats.review.received.neutral,
                    negative: user.stats.review.received.negative,
                },
            },
            signals: {
                hasNegativeReviews: user.stats.review.received.negative > 0,
                hasVouches: user.stats.vouch.received.count > 0,
            },
            meta: {
                firstSeenAt: null,
                lastUpdatedAt: null, // API doesn't provide — explicit absence over fabricated defaults
                activeSinceDays: null,
            },
        };
        return { availability: 'available', facet };
    }
    catch {
        return { availability: 'error' };
    }
}
