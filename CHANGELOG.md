# Changelog

## [0.3.0] — 2026-01-22

### Added
- **Creator Score support** — Expanded Talent facet with creator credibility
  - New field: `TalentData.creatorScore` (optional)
  - New field: `TalentData.creatorLevel` (optional, derived when levels enabled)
  - New signal: `TalentSignals.verifiedCreator` (true when creatorScore > 0)
  - New level policy: `creator@v1` (Emerging → Elite, 6 levels)

### Changed
- Talent repository now uses `/scores` endpoint to fetch all scores in one call
- Builder and Creator scores are parallel axes of credibility (non-hierarchical)

### Characteristics
- Creator Score levels use same thresholds as Builder Score with different labels
- All new fields are optional — existing consumers work unchanged
- Undocumented score variants (e.g., `builder_score_2025`) are explicitly ignored
- Per Phase 2 specification

---

## [0.2.0] — 2026-01-22

### Added
- **Level derivation system** — Derives semantic levels from raw scores
  - Ethos credibility levels (`ethos@v1`): Untrusted → Renowned (10 levels)
  - Talent builder levels (`builder@v1`): Novice → Master (6 levels)
- New types: `BaseCredLevel`, `LevelConfig`
- New fields: `EthosData.credibilityLevel`, `TalentData.builderLevel`
- Level derivation enabled by default, opt-out via `levels: { enabled: false }`

### Characteristics
- Levels are derived from documented upstream protocol thresholds
- Derivation is deterministic and versioned (e.g., `ethos@v1`)
- Graceful degradation for out-of-range scores
- Additive changes only — existing code continues to work

---

## [0.1.1] — 2026-01-22

### Changed
- Updated repository URL to `github.com/GeoartStudio/basecred-sdk`
- Added homepage: `basecredsdk.geoart.studio`

---

## [0.1.0] — 2026-01-22

### Added
- Initial release of `basecred-sdk`
- Unified, neutral profile assembly from:
  - Ethos Network (social credibility signals)
  - Talent Protocol (builder credibility score)

### Characteristics
- Explicit availability states for each source
- Partial responses supported
- No rankings, percentiles, or trust verdicts
- No aggregation or interpretation logic
- Schema locked per Phase 0 Foundation

### Stability
- Phase 1 (Feasibility) is frozen
- No semantic changes will be introduced without a major version bump
