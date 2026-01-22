# basecred-sdk

A neutral, composable SDK that fetches and assembles reputation data from [Ethos Network](https://ethos.network) and [Talent Protocol](https://talentprotocol.com).

This SDK exists to make reputation data observable without turning it into judgment.

## What This SDK Does

- Fetches Ethos social credibility signals (vouches, reviews, raw score)
- Fetches Talent Protocol builder and creator credibility (builder score, creator score)
- Derives semantic levels from scores (enabled by default)
- Returns a unified, neutral profile
- Explicitly declares absence and failure states

## What This SDK Does NOT Do

- No rankings
- No percentiles
- No trust verdicts
- No aggregation or interpretation
- No gamification logic

## Installation

```bash
npm install basecred-sdk
```

> Requires Node.js 18+ (uses native `fetch`).

This SDK is intended for applications that need neutral access to reputation signals without embedded judgment or ranking logic.

## Usage

```ts
import { getUnifiedProfile } from 'basecred-sdk';

const profile = await getUnifiedProfile(
  '0xabc...',
  {
    ethos: {
      baseUrl: 'https://api.ethos.network',
      clientId: 'your-app@0.1.0',
    },
    talent: {
      baseUrl: 'https://api.talentprotocol.com',
      apiKey: process.env.TALENT_API_KEY!,
    },
  }
);

// Level derivation is enabled by default.
// To disable level derivation:
const profileWithoutLevels = await getUnifiedProfile(
  '0xabc...',
  {
    ethos: { /* ... */ },
    talent: { /* ... */ },
    levels: { enabled: false },
  }
);
```

**Note:**
- Ethos Network does not require an API key
- Talent Protocol requires an API key (request one at [talentprotocol.com](https://talentprotocol.com))

## Output Schema

```json
{
  "identity": {
    "address": "0xabc..."
  },
  "availability": {
    "ethos": "available",
    "talent": "available"
  },
  "ethos": {
    "data": {
      "score": 1732,
      "credibilityLevel": {
        "value": 1732,
        "level": "Established",
        "levelSource": "sdk",
        "levelPolicy": "ethos@v1"
      },
      "vouchesReceived": 5,
      "reviews": {
        "positive": 12,
        "neutral": 1,
        "negative": 0
      }
    },
    "signals": {
      "hasNegativeReviews": false,
      "hasVouches": true
    },
    "meta": {
      "firstSeenAt": null,
      "lastUpdatedAt": null,
      "activeSinceDays": null
    }
  },
  "talent": {
    "data": {
      "builderScore": 196,
      "builderLevel": {
        "value": 196,
        "level": "Expert",
        "levelSource": "sdk",
        "levelPolicy": "builder@v1"
      },
      "creatorScore": 97,
      "creatorLevel": {
        "value": 97,
        "level": "Established",
        "levelSource": "sdk",
        "levelPolicy": "creator@v1"
      }
    },
    "signals": {
      "verifiedBuilder": true,
      "verifiedCreator": true
    },
    "meta": {
      "lastUpdatedAt": "2026-01-22T15:22:46Z"
    }
  }
}
```

### Level Derivation

The SDK derives semantic levels from raw scores using documented upstream protocol thresholds.

**Ethos Credibility Levels** (`ethos@v1`):

| Score | Level |
|-------|-------|
| 0-799 | Untrusted |
| 800-1199 | Questionable |
| 1200-1399 | Neutral |
| 1400-1599 | Known |
| 1600-1799 | Established |
| 1800-1999 | Reputable |
| 2000-2199 | Exemplary |
| 2200-2399 | Distinguished |
| 2400-2599 | Revered |
| 2600-2800 | Renowned |

**Talent Builder Levels** (`builder@v1`):

| Score | Level |
|-------|-------|
| 0-39 | Novice |
| 40-79 | Apprentice |
| 80-119 | Practitioner |
| 120-169 | Advanced |
| 170-249 | Expert |
| 250+ | Master |

**Talent Creator Levels** (`creator@v1`):

| Score | Level |
|-------|-------|
| 0-39 | Emerging |
| 40-79 | Growing |
| 80-119 | Established |
| 120-169 | Accomplished |
| 170-249 | Prominent |
| 250+ | Elite |

Level derivation is:
- **Enabled by default** — set `levels: { enabled: false }` to disable
- **Deterministic** — same score always maps to same level
- **Versioned** — policy identifier included in output (e.g., `ethos@v1`)

### Availability States

Each source declares exactly one state:

| State | Meaning |
|-------|---------|
| `available` | Profile exists, data fetched |
| `not_found` | No profile exists |
| `unlinked` | Identity exists but not linked |
| `error` | API error or failure |

Partial responses are valid. Both facets are optional based on availability.

## Design Principles

- **Absence is explicit** — Missing data is declared, never hidden
- **Time matters more than score** — Temporal fields enable continuity analysis
- **Sources are parallel** — Ethos and Talent are peers, not ranked
- **Data is reported, not judged** — Consumers interpret meaning

## Non-Goals

This SDK intentionally does NOT:

- Decide trustworthiness
- Rank users
- Compare users
- Produce composite scores
- Replace human judgment

## Error Handling

This SDK never throws on valid input.

All failures are surfaced explicitly via the `availability` field for each source. Consumers should check `availability.ethos` and `availability.talent` to determine data presence.

## Status

**v0.3.0 — Score Expansion**

Phase 2 complete. The SDK now supports both Builder and Creator scores from Talent Protocol as parallel credibility axes.

## License

MIT
