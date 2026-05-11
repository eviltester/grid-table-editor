# Options Catalog Change Checklist

Use this checklist when adding/changing/removing output format options.

## 1. Update Core Catalog First

- Update `packages/core/js/options/format-option-catalog.js`:
  - `OPTION_KEYS_BY_FORMAT`
  - `OPTION_TIPS_BY_FORMAT`
  - normalization aliases (if needed)
- Ensure exports remain available from `@anywaydata/core`.

## 2. Update Surface Consumers

- API service consumes updated keys/tips via core helpers.
- MCP option schema descriptions reflect core tips.
- CLI normalization/sanitization paths still align to core.
- UI option panels bind help and option filtering to shared catalog/adapter paths.

## 3. Add/Update Tests

- Core catalog unit tests.
- API options tests (keys/tips + lifecycle behavior).
- MCP option schema description parity tests.
- CLI normalization/sanitization tests.
- UI parity tests for option help icon bindings.
- Cross-surface parity fixture:
  - `tests/integration/cross-surface-option-parity.test.js`

## 4. Browser/UI Test Validation (for UI changes)

- Run `npm run test:browser`.
- Run `npm test` for UI Jest suites (or full `npm test`).

## 5. Final Gate

- Run `npm run verify:local`.
- Do not mark complete unless gate passes.
