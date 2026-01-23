# Design Philosophy

This document explains the architectural decisions behind `basecred-sdk`.

---

## North Star

This SDK is built for **builders who care about real users and long-term contributors**.

It is explicitly **not** designed for:
- Growth farming
- Transaction farming
- Short-term KPI optimization

The SDK prioritizes:
- Signal over noise
- Continuity over spikes
- Evidence over conclusions

---

## Core Principle: Facets, Not Scores

Reputation is represented as **independent facets**, not a verdict.

| Facet | Source | Meaning |
|-------|--------|---------|
| Social credibility | Ethos Network | How others relate to this person |
| Builder credibility | Talent Protocol | Evidence of building over time |
| Creator credibility | Talent Protocol | Evidence of creating over time |

Facets are:
- **Parallel** — neither dominates the other
- **Composable** — consumers combine as needed
- **Non-hierarchical** — no implicit ranking

Builder and Creator are **parallel axes** within the Talent facet — a wallet may have one, both, or neither.

---

## The SDK Answers

> "Who is this person over time?"

**Not:**

> "Is this person good or bad?"

---

## What This SDK Will Never Do

- Merge Ethos and Talent scores
- Label users as good or bad
- Act as a trust oracle
- Optimize for engagement
- Replace source protocols

---

## Forbidden Fields

These fields exist in source APIs but are **intentionally not exposed**:

| Field | Source | Reason |
|-------|--------|--------|
| `influenceFactor` | Ethos | Gameable metric |
| `XP` | Ethos | Activity farming signal |
| `percentile` | Ethos | Implies ranking |
| `rank_position` | Talent | Implies competition |
| `builder_score_2025` | Talent | Undocumented score variant |

---

## Availability Semantics

Every response explicitly declares data availability:

| State | Meaning |
|-------|---------|
| `available` | Profile exists, data fetched |
| `not_found` | No profile exists for this address |
| `unlinked` | Identity exists but not linked |
| `error` | API error or failure |

**Rules:**
- Partial responses are valid
- Absence is always explicit
- Silent defaults are forbidden

---

## Validation Criteria

The SDK was validated against these criteria:

| Criterion | Question |
|-----------|----------|
| Neutral output | Does output avoid labeling or judging? |
| Explicit absence | Is missing data clearly communicated? |
| Time over score | Does schema favor continuity over snapshots? |
| Anti-gamification | Is the SDK resistant to artificial reputation? |

All criteria passed.

---

## Time Semantics

The SDK computes derived time fields to answer temporal questions:

| Field | Derived From | Question Answered |
|-------|--------------|-------------------|
| `activeSinceDays` | `firstSeenAt` | How long has this profile existed? |
| `lastUpdatedDaysAgo` | `lastUpdatedAt` | How fresh is this data? |
| `recency.bucket` | Most recent update | Is this profile active or dormant? |

**Rules:**
- All time calculations are mechanical (floor, UTC)
- Future timestamps return 0
- Missing timestamps result in `null`
- Recency is omitted if no facet has `lastUpdatedAt`

---

## Schema Stability

**Status: v0.5.1**

The SDK computes time-based fields from upstream timestamps. All fields are optional and backwards compatible.

---

## Architecture

```
src/
├── types/           # Schema definitions
├── repositories/    # Data access (Ethos, Talent)
├── levels/          # Level derivation policies (ethos@v1, builder@v1, creator@v1)
└── use-cases/       # Business logic (getUnifiedProfile)
```

**Layer rules:**
- Types define the contract
- Repositories fetch and map data (no business logic)
- Levels derive semantic meaning from scores
- Use-cases orchestrate without interpretation
