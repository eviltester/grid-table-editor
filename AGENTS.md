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
- `verify:ui` is the required additional gate for frontend UI work. Use it when changing frontend components, Storybook stories, browser abstractions, or Playwright specs.
- `verify:ci` is the full aggregate gate, including coverage, used to mirror the main-branch CI path locally.
- Pull request CI runs parallel independent gates and intentionally skips coverage; coverage runs on `master` push CI.

## Browser Test Interaction Rules

When changing UI code, UI test abstractions, or browser tests:

- run `pnpm run verify:ui`
- run `pnpm run test:browser`
- run `pnpm run test:storybook`
- run `pnpm run build-storybook`
- run `pnpm test` (or targeted UI Jest suites) for `packages/core-ui/src/tests` and `apps/web/src/tests/jest`

For browser tests and page-object abstractions:

- treat the app as a black box
- use user-like interactions only (`click`, `fill`/`type`, keyboard navigation, blur/focus changes)
- assert outcomes by polling rendered UI state
- do not use synthetic event dispatch or direct DOM hooks to force app sync in browser abstractions (e.g. `dispatchEvent(...)`, `evaluate(...)` used to trigger internal listeners)

## Frontend Selector Contracts

When changing reusable components, stories, component tests, Playwright tests, or Playwright page objects:

- keep fixed IDs for page-level mount roots and intentional legacy DOM contracts only
- prefer classes for styling hooks
- prefer root-scoped `data-*` behavior hooks for reusable component internals when role/name queries are not practical
- prefer role/name queries in Storybook interactions, DOM/component tests, Playwright tests, and Playwright page objects
- amend Playwright page objects when component markup changes so they keep using user-facing roles/names or intentional page-level contracts rather than reusable-component internals
- amend component tests when component markup changes so they query rendered behavior, accessible names, or root-scoped `data-*` hooks instead of fixed internal IDs
- treat new ID-based story/test queries as a design smell unless the ID is part of a documented public page contract

## Frontend Component Migration

When changing frontend UI code, Storybook stories, UI test abstractions, or browser tests:

- read `docs/frontend-component-migration-plan.md` before making changes
- read `docs/frontend-component-architecture.md` for the current page/component/service layering model
- read `docs/frontend-legacy-ui-elimination-plan.md` when changing or discovering UI code that still uses legacy controls, broad imperative helpers, document-scoped lookup, or compatibility facades
- prefer the `Controller + View + createComponent` pattern for new or migrated UI components
- keep components mounted into one explicit root element
- avoid global `document.querySelector`/`getElementById` inside reusable components; query within the component root instead
- treat document-global lookup from inside a reusable component as a bug unless it is an explicitly injected browser service concern such as document head/style injection, top-level modal host management, or page bootstrap
- if a migrated component still depends on legacy helpers that use global DOM lookup internally, treat that migration as incomplete and add a follow-up todo to remove the remaining global coupling
- inject services, callbacks, `documentObj`, and `windowObj` explicitly
- add or update Storybook coverage for every new or migrated component
- keep Storybook harnesses small; large harnesses are a signal that the component boundary may need more work
- treat Storybook as a review, documentation, and lightweight interaction-example layer, not the primary automated test layer
- use unit tests and DOM/component tests as the main automated coverage for component behavior
- use Playwright for page-level integration and full browser workflows
- isolate Tabulator, file APIs, clipboard, downloads, timers, and dialogs behind adapters or injected services
- put low-level UI building blocks under `packages/core-ui/js/gui_components/shared/primitives/` when they are intended as foundations rather than page-facing shared components
- prefer page/features consuming higher-level presenter, service, or feature-component APIs instead of wiring directly to primitives when such an API exists
- treat `docs/frontend-component-migration-plan.md` updates as part of the definition of done for migration work
- update `docs/frontend-component-migration-plan.md` when completing, changing, or discovering migration tasks
- when a migration step reveals follow-up work, add an explicit unchecked todo item in the relevant phase instead of leaving it only in narrative notes

For migrated components, prefer focused Jest tests for controller behavior and user-like DOM/browser tests for rendered interaction.

## Frontend Component Test Expectations

For new shared UI components, comprehensive test coverage is part of the definition of done.
For new shared UI components, Storybook docs that explain the component, its key states, and its behavior modes are part of the definition of done.

When creating or migrating a frontend component:

- add or update unit tests for controller logic, including invalid inputs, boundary values, and emitted callbacks
- add or update DOM/component tests for rendered behavior and user-like interaction
- add or update Storybook stories for key states and interaction examples
- add or update Storybook docs so a reviewer can understand the component without reading the implementation first
- when Storybook docs describe behavior modes, add one explicit primary story per documented mode with names and interactions that clearly demonstrate those modes
- do not rely on implementation inference when behavior can be covered by an automated test
- cover happy path, invalid input, boundary conditions, and cleanup/destroy behavior for new shared components
- if a component supports configurable behavior or modes, add tests for each materially different mode
- if a bug, question, or review comment identifies an uncovered behavior, add a regression test before considering the work complete

For `Controller + View + createComponent` components, test all three layers at the appropriate level:

- controller unit tests for parsing, validation, state transitions, and callbacks
- view/component tests for DOM rendering and user interaction
- Playwright only when the composed page behavior is affected

## Storybook Story Quality

Storybook stories are part of the component documentation, so their defaults and descriptions must be chosen to teach the component clearly.

When creating or updating Storybook stories:

- treat each story as a reviewer-facing example, not just a mount test
- if a story visibly renders a child component’s real UI, that child must use real behavior rather than a stubbed or fake implementation
- only mock or replace a child component when the story also replaces its visible UI with an explicit placeholder or abstraction
- choose default args that make the intended behavior easy to observe immediately
- prefer values that clearly illustrate boundaries and mode differences over production-minimal defaults
- when a story demonstrates validation, normalization, or clamping, use defaults that make the effect obvious with simple interaction
- add story descriptions that explain:
  - what the story demonstrates
  - which defaults or limits matter
  - what the reviewer should try in the UI
  - what outcome they should expect
- if the Actions panel or callbacks help explain behavior, mention exactly what a reviewer should look for there
- when docs describe behavior modes, create one explicit primary story per mode
- story names, story descriptions, args, and play interactions should all align to the same teaching goal
- if a story’s defaults do not clearly illustrate the documented behavior, adjust the defaults rather than relying on the reviewer to discover the right inputs
