# Agent Working Agreement

## Definition of Done for Code Changes

Before reporting a coding task as complete, run:

```bash
npm run verify:local
```

and include the result status in the final update.

If verification fails:

- do not mark the task as done
- report the failing command(s)
- include the relevant error summary
- fix issues where possible, then re-run verification

## Notes

- `verify:local` is the canonical local gate for this repo.
- CI uses `verify:ci` and branch protection should require CI to pass before merge.

## Browser Test Interaction Rules

When changing UI code, UI test abstractions, or browser tests:

- run `npm run test:browser`
- run `npm test` (or targeted UI Jest suites) for `packages/core-ui/src/tests` and `apps/web/src/tests/jest`

For browser tests and page-object abstractions:

- treat the app as a black box
- use user-like interactions only (`click`, `fill`/`type`, keyboard navigation, blur/focus changes)
- assert outcomes by polling rendered UI state
- do not use synthetic event dispatch or direct DOM hooks to force app sync in browser abstractions (e.g. `dispatchEvent(...)`, `evaluate(...)` used to trigger internal listeners)
