# Options Catalog Source Of Truth

## Purpose

This project uses a single shared options catalog in `@anywaydata/core` as the source of truth for:

- supported option keys per output format
- option help/tip text per output format
- format normalization
- options sanitization

## Source

- `packages/core/js/options/format-option-catalog.js`
- exported via `packages/core/src/index.js`

## Consumer Boundaries

### Core

- owns `OPTION_KEYS_BY_FORMAT`, `OPTION_TIPS_BY_FORMAT`, `normalizeFormat`, `sanitizeOptionsForFormat`, `getTipsForFormat`.

### API

- may own runtime mutable state (custom defaults/custom tips).
- must not duplicate static key/tip catalogs.
- sanitization and baseline tips must come from `@anywaydata/core`.

### MCP

- must derive option schema descriptions from `getTipsForFormat`.
- must not maintain duplicate static tip maps.

### CLI

- format normalization/validation must use core helpers.
- option object filtering must use core sanitization.
- CLI UX and flags may evolve independently, but catalog semantics must stay shared.

### UI / Core-UI

- option panel tip assignment for shared options must resolve from `getTipsForFormat`.
- framework groups/order metadata used across UI surfaces should live in shared UI adapter modules, not per-panel duplication.
- UI-only tips that do not map to core option keys should remain in dedicated UI-only tip modules.

## Drift Guardrails

- cross-surface integration parity test: `tests/integration/cross-surface-option-parity.test.js`
- UI help parity tests in `packages/core-ui/src/tests/utils`
- API/MCP/CLI unit tests that verify normalization/sanitization/tips usage

## Non-Goals

- This contract does not force all surface-specific UX strings into core.
- UI layout, labels, grouping presentation, and surface ergonomics can vary where they do not conflict with catalog semantics.
