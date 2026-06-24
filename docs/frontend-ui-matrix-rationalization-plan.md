# Frontend UI Matrix Rationalization Plan

This plan tracks how to reduce redundant UI matrix coverage now that the app page and generator page share much more of the same component structure.

The earlier matrix work was valuable when the app-hosted test-data panel and the standalone generator UI had meaningfully different implementations. After the component migration, broad app-vs-generator scenario sweeps now provide less unique signal and more duplicated maintenance cost. The goal of this plan is to keep the useful coverage while retiring the parts that mostly re-test shared components through two different shells.

Use this document with:

- `docs/frontend-component-architecture.md`
- `docs/frontend-component-migration-plan.md`
- `docs/frontend-legacy-ui-elimination-plan.md`
- `AGENTS.md`

## Recommended Sequencing

Do not treat matrix rationalization as a reason to pause the active component refactor. The recommended order is:

1. Continue component refactoring and legacy UI elimination first.
2. Perform only a narrow matrix triage while that refactor is still active.
3. Perform the full matrix rationalization after the shared app/generator component boundaries are more stable.
4. Finish with a comprehensive coverage review.

Why this order:

- the right matrix shape depends on where shared behavior finally lives
- broad parity cleanup done too early will likely need to be revisited as feature boundaries keep moving
- the highest-value work is still removing legacy UI structure and stabilizing shared components
- matrix cleanup is more accurate once the remaining page-specific differences are smaller and easier to see

## What To Do Now vs Later

Do now:

- fix or quarantine clearly broken high-noise matrix failures that block routine work
- avoid adding new broad app-vs-generator parity scenarios
- document which current matrix suites are likely to shrink later

Do later:

- redesign the retained parity contract
- move duplicated assertions to component tests
- shrink or retire broad JSDOM app/generator parity sweeps
- simplify matrix harnesses after retained coverage is known

## Goal

Keep high-signal automated coverage for:

- shared component behavior
- page-specific wiring and defaults
- runtime data-generation semantics
- real browser workflows

Reduce or remove low-signal automated coverage that:

- runs the same shared schema/test-data behavior through both app and generator shells
- repeats component behavior already covered by controller, DOM, and browser tests
- creates expensive parity suites whose failures are hard to interpret

## Target Standard

The frontend test stack should follow these rules:

- Shared component behavior is tested once at the component level, not re-proved through large cross-page matrices.
- Page-specific composition is tested at the page level with focused integration coverage.
- Runtime scenario semantics are tested at the engine/runtime layer without depending on page-shell duplication.
- Browser behavior is tested with Playwright for workflows that need a real browser, real layout, downloads, focus, or page wiring.
- Cross-page parity tests exist only where the app page and generator page still have genuinely different composition or service boundaries.
- Large JSDOM matrices are allowed only when they verify behavior that cannot be covered more directly by component, runtime, or browser tests.

## Current State

Current matrix suites under `packages/core-ui/src/tests/interaction/matrix/` cover two retained concerns:

- `schema-interaction-runtime-matrix.test.js`
  - scenario execution against the runtime/data-generation layer
- `generator-schema-interaction-matrix.test.js`
  - standalone generator UI scenario execution in JSDOM
- `app-schema-interaction-matrix.test.js`
  - embedded app test-data panel scenario execution in JSDOM

The app/generator UI matrices are intentionally small page-wiring smoke suites. Broad app-vs-generator parity coverage was removed because both pages now exercise the same shared internals, while runtime semantics, focused component tests, and browser workflows provide clearer protection.

## Keep / Reduce / Remove Guidance

Keep:

- runtime scenario matrix coverage that validates scenario execution semantics
- focused browser workflows for app and generator pages
- shared component controller and DOM tests

Reduce:

- broad JSDOM app and generator scenario sweeps that duplicate shared component behavior
- broad parity comparison across many scenarios where both pages now exercise the same shared internals

Remove when replacement coverage is in place:

- app-vs-generator parity checks that only prove shared component output equality
- duplicate scenario coverage that can be expressed more clearly as component tests or a small smoke parity set

## Phase 0: Immediate Matrix Triage

Goal: keep the current matrix suite from creating avoidable day-to-day drag while the component refactor continues.

- [ ] Identify matrix failures that are clearly broken or noisy rather than behaviorally useful.
- [ ] Fix, quarantine, skip, or isolate those failures only where needed to keep normal frontend work moving.
- [ ] Avoid broad rewrites of the matrix suites during this phase.
- [ ] Mark likely shrink/remove candidates in the affected test files or follow-up tracking docs.

Exit criteria:

- The matrix suite is no longer a disproportionate source of noise for unrelated frontend changes.
- We have not spent component-refactor time prematurely redesigning the whole matrix layer.

## Phase 1: Coverage Inventory And Classification

Goal: make each current matrix test justify its existence in the new shared-component architecture.

- [ ] List every current matrix suite and classify its purpose as runtime semantics, shared component behavior, page wiring, or cross-page parity.
- [ ] Map each scenario assertion to the lowest sensible layer: runtime, component, page integration, or browser.
- [ ] Mark each current matrix assertion as keep, move, shrink, or retire.
- [ ] Identify current failures and instability causes separately from redundancy concerns, so cleanup decisions are not driven only by flakiness.

Exit criteria:

- Every matrix suite has a clear purpose statement and a proposed target size.
- We know which assertions are still unique and which are duplicate coverage.

## Phase 2: Define The Replacement Coverage Model

Goal: agree what should live at each test layer before deleting broad matrix coverage.

- [ ] Define the minimum shared-component test expectations for schema editing, schema/text sync, command selection, preview generation, pairwise availability, and output-format interactions.
- [ ] Define the minimum page-level integration expectations for the app-hosted panel and standalone generator shell.
- [ ] Define the minimum browser workflows that must remain for app and generator pages.
- [ ] Define the minimum cross-page parity contract that still matters after component reuse.

Recommended standard:

- Shared behavior belongs in controller and DOM/component tests.
- Page-shell behavior belongs in focused app/generator integration tests.
- Real browser workflows belong in Playwright.
- Cross-page parity should be reduced to a small representative contract, not a broad scenario sweep.

Exit criteria:

- There is a documented target layer for every major test-data behavior.
- We have a replacement destination for any matrix assertion we plan to remove.

## Phase 3: Retire Broad Cross-Page Parity

Goal: keep cross-page checks only where they prove something unique.

- [x] Remove the large `ui-schema-interaction-parity.test.js` sweep.
- [x] Remove parity fixture generation and static parity/report artifacts.
- [x] Keep app and generator page coverage as separate smoke suites so failures identify the broken shell directly.
- [x] Rely on runtime matrix coverage for broad scenario semantics and browser tests for user-visible workflows.

Candidate parity survivors:

- one simple literal/regex scenario
- one faker/domain command scenario
- one pairwise-eligible scenario
- one structured serialization scenario
- one page-default/options scenario if app and generator still configure it differently

Exit criteria:

- Cross-page parity coverage no longer duplicates shared component output through both shells.
- Failing page-shell tests point to the app or generator wiring that actually regressed.

## Phase 4: Move Shared Behavior Coverage Down To Components

Goal: test shared behavior where it lives now.

- [ ] Add or strengthen controller tests for shared schema logic, generation controls, row-count behavior, and option application.
- [ ] Add or strengthen DOM/component tests for row editing, schema/text sync, preview triggers, pairwise visibility, and error/status rendering.
- [ ] Ensure component tests cover the shared behavior previously only exercised through app/generator matrix scenarios.

Exit criteria:

- Shared behavior no longer depends on app/generator matrix suites for primary protection.
- A contributor can understand a failure by reading the relevant component test rather than a large matrix harness log.

## Phase 5: Keep Focused Page-Level Integration Coverage

Goal: preserve coverage for the parts that are still page-specific.

- [ ] Keep a small app integration suite for embedded test-data panel wiring.
- [ ] Keep a small generator integration suite for standalone generator-shell wiring.
- [ ] Remove scenario cases from those suites that only duplicate shared component behavior with no page-specific value.
- [ ] Ensure page-level integration tests focus on mount wiring, service composition, and page defaults.

Exit criteria:

- The app suite proves the embedded panel wiring still works.
- The generator suite proves the standalone generator workflow still works.
- Neither suite acts as a hidden replacement for missing component tests.

## Phase 6: Confirm Real Browser Coverage

Goal: make sure any removed matrix coverage is backed by real browser confidence where needed.

- [ ] Audit existing Playwright app test-data flows under `apps/web/src/tests/browser/app/functional/test-data/`.
- [ ] Audit existing Playwright generator flows under `apps/web/src/tests/browser/generator/functional/`.
- [ ] Add or tighten browser coverage only where the removed matrix tests were covering true page/browser behavior.
- [ ] Do not recreate large scenario matrices in Playwright; keep browser coverage workflow-focused.

Exit criteria:

- Real browser workflows still cover the user-visible paths that matter.
- Playwright remains focused on browser behavior, not exhaustive scenario enumeration.

## Phase 7: Simplify Or Retire Matrix Harnesses

Goal: reduce maintenance overhead in the test infrastructure itself.

- [x] Remove harness code that exists only for broad parity sweeps no longer required.
- [ ] Simplify app/generator interaction harnesses to the smaller retained scenario sets.
- [x] Delete helper utilities and fixture complexity that no longer serve a retained suite.
- [ ] Update contributor docs so the intended role of runtime matrix, component tests, and browser tests is explicit.

Exit criteria:

- The harness layer is easier to understand and cheaper to maintain.
- New contributors are not pushed toward adding more broad parity scenarios by default.

## Phase 8: Comprehensive Review

Goal: verify that rationalization removed duplication without creating blind spots.

- [ ] Review all retained runtime, component, page-integration, Storybook, and browser coverage for schema/test-data behavior.
- [ ] Check whether any behavior still depends on broad JSDOM matrix tests as its only protection.
- [ ] Check whether any remaining parity tests still provide unique signal.
- [ ] Decide whether more parity reduction is safe, or whether a small additional representative case should remain.
- [ ] Update this plan and the migration docs with final status and any follow-up actions.

Exit criteria:

- The remaining automated coverage is intentionally layered and non-duplicative.
- Any remaining matrix coverage has a clear reason to exist.
- Follow-up work, if any, is captured explicitly rather than left as tribal knowledge.

## Definition Of Done For This Rationalization

This plan is complete when:

- broad duplicated app-vs-generator parity coverage has been retired in favor of separate smoke suites
- shared behavior is primarily covered by component tests
- page-specific behavior is primarily covered by focused integration and browser tests
- runtime semantics remain covered independently of page-shell duplication
- the remaining matrix suites are fast enough, stable enough, and clear enough to justify their cost

## Suggested First Slice

The safest first implementation slice is:

1. Complete Phase 0 and Phase 1 as a paper audit.
2. Complete Phase 2 as the replacement coverage model.
3. Retire `ui-schema-interaction-parity.test.js` once app/generator smoke coverage is in place.
4. Keep the runtime matrix unchanged.
5. Re-run coverage review before shrinking the app and generator JSDOM matrices.

That path removes the most obvious duplication first while preserving the highest-signal runtime coverage.

### Current Status

- The runtime matrix remains the broad generated safety net.
- `app-schema-interaction-matrix.test.js` and `generator-schema-interaction-matrix.test.js` now run a page-wiring smoke subset instead of the full shared `uiScenarios` fixture.
- The retained page-shell smoke scenarios are:
  - `custom-literal-base`
  - `custom-regex-base`
  - `faker-helpers-arrayElement-base`
  - `domain-commerce-price-example-1`
  - `custom-enum-pairwise`
- The smoke subset keeps:
  - simple schema editing and generate wiring
  - regex/text synchronization coverage
  - one representative faker helper flow
  - one representative domain/options flow
  - pairwise wiring coverage
- The broad app-vs-generator parity sweep, parity fixture writer, parity fixture JSON, and static matrix summary artifact have been removed.
- The retained matrix formatting helper only formats chunk labels and command summaries for the active runtime and smoke suites.
