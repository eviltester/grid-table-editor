# Agent Working Agreement

## Definition of Done for Code Changes

Before reporting a coding task as complete, run:

```bash
pnpm run verify:local
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

- run `pnpm run test:browser`
- run `pnpm test` (or targeted UI Jest suites) for `packages/core-ui/src/tests` and `apps/web/src/tests/jest`

For browser tests and page-object abstractions:

- treat the app as a black box
- use user-like interactions only (`click`, `fill`/`type`, keyboard navigation, blur/focus changes)
- assert outcomes by polling rendered UI state
- do not use synthetic event dispatch or direct DOM hooks to force app sync in browser abstractions (e.g. `dispatchEvent(...)`, `evaluate(...)` used to trigger internal listeners)

## Frontend Component Migration

When changing frontend UI code, Storybook stories, UI test abstractions, or browser tests:

- read `docs/frontend-component-migration-plan.md` before making changes
- prefer the `Controller + View + createComponent` pattern for new or migrated UI components
- keep components mounted into one explicit root element
- avoid global `document.querySelector`/`getElementById` inside reusable components; query within the component root instead
- inject services, callbacks, `documentObj`, and `windowObj` explicitly
- add or update Storybook coverage for every new or migrated component
- keep Storybook harnesses small; large harnesses are a signal that the component boundary may need more work
- treat Storybook as a review, documentation, and lightweight interaction-example layer, not the primary automated test layer
- use unit tests and DOM/component tests as the main automated coverage for component behavior
- use Playwright for page-level integration and full browser workflows
- isolate Tabulator, file APIs, clipboard, downloads, timers, and dialogs behind adapters or injected services
- update `docs/frontend-component-migration-plan.md` when completing, changing, or discovering migration tasks

For migrated components, prefer focused Jest tests for controller behavior and user-like DOM/browser tests for rendered interaction.
