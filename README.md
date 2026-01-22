# basecred-sdk

A neutral, composable SDK that fetches and assembles reputation data from [Ethos Network](https://ethos.network) and [Talent Protocol](https://talentprotocol.com).

This SDK exists to make reputation data observable without turning it into judgment.

## What This SDK Does

- Fetches Ethos social credibility signals (vouches, reviews, raw score)
- Fetches Talent Protocol builder credibility (builder score)
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
      "builderScore": 812
    },
    "signals": {
      "verifiedBuilder": true
    },
    "meta": {
      "lastUpdatedAt": "2026-01-18T09:11:00Z"
    }
  }
}
```

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

**Feasibility (Frozen)**

The schema is locked. No new fields, interpretations, or semantic changes.

## License

MIT
