# Component Review Fix Plan

This plan captures the follow-up work from the architectural review of the migrated frontend components and their Storybook coverage. It is a post-migration hardening backlog, not a replacement for `docs/frontend-component-migration-plan.md` or `docs/frontend-component-architecture.md`.

Use this document when starting a component hardening session. Update checkboxes as work completes, and add explicit new todos when a fix reveals follow-up work.

## Goals

- Reduce page-global coupling in reusable and feature components.
- Make components safe to mount more than once in the same document.
- Make Storybook stories reliable reviewer-facing examples rather than harness workarounds.
- Improve cleanup and lifecycle coverage for presenters, timers, modals, grids, and tooltips.
- Tighten automated coverage around component contracts that can regress quietly.
- Keep Playwright page objects and browser specs aligned with user-facing selectors.

## Definition Of Done

For every completed item in this plan:

- Add or update focused Jest tests for the affected controller, view, service, or presenter.
- Add or update Storybook stories and interactions when reviewer-facing behavior changes.
- Add or update Playwright page objects and browser tests when page-level behavior or selectors change.
- Prefer role/name queries in tests; use root-scoped `data-*` hooks only when accessible queries are impractical.
- Run `pnpm run verify:local` before marking the work complete.
- For UI/page-level changes, also run `pnpm run test:browser`, `pnpm run test:storybook`, and `pnpm run build-storybook`.

## Phase 1: Browser-Global Safety

Remove unsafe default references to browser globals from reusable and feature component factories/views.

Current progress:
- Added a shared DOM default helper at `packages/core-ui/js/gui_components/shared/dom/default-objects.js`.
- Migrated the first component batch to root/ownerDocument-safe resolution: format options panel, shared schema definition, instructions, data population panel, import/export workspace, population actions, population mode selector, text preview editor, format selector, data-grid editor shell/grid toolbar, generator controls, generator preview, generator page, timed status presenter, and help tooltip bootstrap.
- Added focused non-browser construction coverage for generator controls, generator preview, import/export workspace, and status presenters.
- Finished the remaining named holdouts in this audit slice: generator bootstrap/runtime, shared schema editor, method picker modal, import-export toolbar, and the shared schema-definition controller.

- [x] Replace `documentObj = document` defaults with browser-safe helpers in shared components.
- [x] Replace `windowObj = documentObj?.defaultView || window` defaults with browser-safe helpers.
- [x] Add non-browser construction tests for shared component factories that can be created without an injected `documentObj`.
- [x] Add null-document safety tests for presenter/service APIs that should no-op without DOM.
- [x] Audit and fix these known files:
  - `packages/core-ui/js/gui_components/shared/format-options-panel/index.js`
  - `packages/core-ui/js/gui_components/shared/format-options-panel/format-options-panel-view.js`
  - `packages/core-ui/js/gui_components/shared/schema-definition/index.js`
  - `packages/core-ui/js/gui_components/shared/schema-definition/shared-schema-definition-view.js`
  - `packages/core-ui/js/gui_components/shared/instructions/index.js`
  - `packages/core-ui/js/gui_components/shared/timed-error-display.js`
  - `packages/core-ui/js/gui_components/app/data-population-panel/index.js`
  - `packages/core-ui/js/gui_components/app/data-population-panel/data-population-panel-view.js`
  - `packages/core-ui/js/gui_components/app/import-export-workspace/index.js`
  - `packages/core-ui/js/gui_components/app/import-export-workspace/import-export-workspace-view.js`
  - `packages/core-ui/js/gui_components/app/population-actions/index.js`
  - `packages/core-ui/js/gui_components/app/population-actions/population-actions-view.js`
  - `packages/core-ui/js/gui_components/app/population-mode-selector/index.js`
  - `packages/core-ui/js/gui_components/app/population-mode-selector/population-mode-selector-view.js`
  - `packages/core-ui/js/gui_components/app/text-preview-editor/text-preview-editor-view.js`
  - `packages/core-ui/js/gui_components/data-grid-editor/index.js`
  - `packages/core-ui/js/gui_components/data-grid-editor/data-grid-component-view.js`
  - `packages/core-ui/js/gui_components/data-grid-editor/grid-toolbar/index.js`
  - `packages/core-ui/js/gui_components/data-grid-editor/grid-toolbar/grid-toolbar-view.js`
  - `packages/core-ui/js/gui_components/generator/controls/index.js`
  - `packages/core-ui/js/gui_components/generator/controls/generator-controls-view.js`
  - `packages/core-ui/js/gui_components/generator/preview/index.js`
  - `packages/core-ui/js/gui_components/generator/preview/generator-preview-view.js`
  - `packages/core-ui/js/gui_components/generator/page/index.js`
  - `packages/core-ui/js/gui_components/generator/page/generator-page-view.js`
- [x] Audit and fix additional browser-global files discovered during the shared-helper pass:
  - `packages/core-ui/js/gui_components/data-grid-editor/tabulator-grid-adapter.js`
  - `packages/core-ui/js/gui_components/data-grid-editor/grid-error-surface.js`
  - `packages/core-ui/js/gui_components/data-grid-editor/gridControl.js`
  - `packages/core-ui/js/gui_components/shared/theme-toggle.js`
  - `packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.js`
  - `packages/core-ui/js/gui_components/shared/test-data/schema/shared-schema-editor-controller.js`
  - `packages/core-ui/js/gui_components/app/import-export-adapters/export-actions-adapter.js`
  - `packages/core-ui/js/gui_components/app/page/app-page-runtime.js`
  - `packages/core-ui/js/gui_components/app/test-data-grid/schema/test-data-grid-schema-grid-controller.js`
  - `packages/core-ui/js/gui_components/generator/runtime/create-generator-page.js`

## Phase 2: Multi-Instance Component Safety

Make reusable and feature components safe to mount more than once in one document without Storybook-specific ID rewriting.

Current progress:
- Added explicit `ids` contracts to `GeneratorControlsView`, `GeneratorPreviewView`, and `PopulationActionsView` for the intentionally public element IDs they still expose.
- Replaced `DataPopulationPanelView`'s internal child-root IDs with root-scoped `data-role` hooks while keeping schema-root ID injection available for the still-legacy schema helpers.
- Added two-instance Jest coverage for generator controls, generator preview, population actions, and data population panel.
- Removed `prefixElementIds(...)` from `apps/web/src/stories/generator-page.stories.js` by passing scoped IDs into the real page component before mount.

- [x] Replace fixed internal IDs in `GeneratorControlsView` with root-scoped refs, generated IDs, or injected `ids`.
- [x] Replace fixed internal IDs in `GeneratorPreviewView` with root-scoped refs, generated IDs, or injected `ids`.
- [x] Replace fixed internal IDs in `PopulationActionsView` with root-scoped refs, generated IDs, or injected `ids`.
- [x] Replace fixed internal IDs in `DataPopulationPanelView` with root-scoped refs, generated IDs, or injected `ids`.
- [x] Add component tests that mount two instances of each affected component into the same document and verify interactions update only the intended instance.
- [x] Remove `prefixElementIds(...)` from `apps/web/src/stories/generator-page.stories.js` after components support scoped IDs properly.
- [x] Remove `createScopedStoryDocument(...)` from `apps/web/src/stories/app-page.stories.js` if component/page APIs no longer need document-proxy lookups.
- [x] Update Playwright page objects when fixed internal IDs are removed or demoted from public contracts.

## Phase 3: Remove Global DOM Coupling From Test-Data Generation

Move remaining app test-data flow DOM access behind component APIs and injected services.

Current progress:
- `test-data-generation-service.js` now uses injected row-count accessors and action busy-state callbacks instead of direct button/input lookups.
- `PopulationActions` and `DataPopulationPanel` now expose explicit busy-state APIs for generate, pairwise, and refresh actions.
- Pairwise visibility is now driven only through `setPairwiseVisible`, and the App page Storybook story no longer needs `createScopedStoryDocument(...)`.
- `test-data-grid-schema-text-sync.js` now accepts injected `documentObj` access rather than using global `document`.
- `test-data-grid-schema-text-sync.js` now supports injected schema text getters, so the last schema-text sync helper no longer has to depend on a page-global textarea lookup.
- Added a two-document controller regression proving per-instance generation status, requested row count, and pairwise visibility stay isolated across separate JSDOM documents.
- `apps/web/src/stories/test-data-embedded-panel.stories.js` now exercises Generate, Generate Pairwise, and Refresh Preview through the composed panel callbacks instead of only checking static state.

- [x] Replace `document.getElementById(...)` use in `test-data-generation-service.js` with injected accessors and callbacks.
- [x] Move generate/pairwise/refresh busy-state updates into `PopulationActions` or a small injected action-state service.
- [x] Move row-count reads into `DataPopulationPanel.getRowCountState()` or an explicit injected `getRequestedRowCount()` callback.
- [x] Replace pairwise button show/hide DOM mutation with `setPairwiseVisible`.
- [x] Replace `document.getElementById(...)` use in `test-data-grid-schema-text-sync.js` with injected schema text element access or `SharedSchemaDefinition` APIs.
- [x] Add a two-document regression test proving generation status, row count, and pairwise visibility do not leak across JSDOM documents.
- [x] Add Storybook interaction coverage for the embedded panel proving Generate, Generate Pairwise, and Refresh Preview call through the composed component APIs.

## Phase 4: Presenter And Timer Lifecycle

Make status presenters and timed status surfaces explicitly disposable and consistent.

Current progress:
- `createStatusPresenter`, `createLoadingStatusPresenter`, and `createTimedStatusPresenter` now expose `destroy()`.
- `GeneratorControlsView` destroys its owned status presenters on teardown.
- Focused Jest coverage exists for destroy-safe status/timed-status behavior, including pending-clear cancellation after destroy.

- [x] Add `destroy()` to `createStatusPresenter` and `createLoadingStatusPresenter`.
- [x] Call presenter `destroy()` from owning views such as `GeneratorControlsView` and any status-owning app features.
- [x] Add regression tests that scheduled clears do not mutate removed DOM after destroy.
- [x] Replace unsafe `documentObj = document` default in `createTimedStatusPresenter`.
- [x] Decide whether `TimedStatusPresenter` should keep `sticky`; if it remains timed-only, remove `sticky` from its public API and docs.
- [x] Align naming and docs around `TimedStatusPresenter`, `StatusPresenter`, and `LoadingStatusPresenter`.
- [x] Add Storybook stories that demonstrate destroy-safe remount behavior where practical, especially for timed status and loading status examples.

## Phase 5: Storybook Harness Cleanup

Make Storybook cleanup automatic and make stories less dependent on global body state.

Current progress:
- Added `renderStoryWithCleanup(...)` so the global Storybook preview decorator and Jest smoke coverage exercise the same cleanup path.
- Added a sequential Storybook cleanup smoke regression that mounts one story with root, modal, and tooltip leftovers, then mounts a second story and proves the previous root and artifacts are removed first.

- [x] Add a global Storybook decorator in `.storybook/preview.js` that calls any previous story root cleanup before rendering a new story.
- [x] Make the decorator remove common body-level artifacts: modal backdrops, method-picker overlays, tippy boxes, and story roots appended directly to `document.body`.
- [x] Prefer returning the story root instead of appending it manually to `document.body` where possible.
- [x] Keep modal and tooltip stories body-aware only where the component behavior genuinely requires a top-level overlay.
- [x] Add a Storybook smoke interaction that mounts stories in sequence and verifies no previous modal/tooltip/root remains visible.
- [x] Document the Storybook cleanup convention in `docs/frontend-component-architecture.md` after the decorator exists.

## Phase 6: Storybook Interaction Quality

Move stories from “something changed” checks toward reviewer-facing behavior checks.

Current progress:
- `SharedSchemaDefinition` now exposes explicit root-scoped `data-role` hooks for the shell, rows region, text region, textbox, mode toggle, add-field button, help icon, footer, and inline error surface.
- `apps/web/src/stories/shared-schema-definition.stories.js` now proves mode switching with explicit hooks and accessible queries instead of CSS `style.display` checks.
- The schema-definition stories now include explicit visible-state assertions across the documented modes: empty schema, sample schema, validation error, text mode, pairwise-capable enum schema, and command picker.
- `apps/web/src/stories/test-data-embedded-panel.stories.js` no longer depends on `#testDataSchemaRows` to verify seeded schema content.
- High-risk format-option stories now assert their emitted apply payloads through a reviewer-visible `Last apply payload` summary instead of only checking the dirty/apply button state.

- [x] Replace `style.display` assertions in schema stories with role/name/visibility assertions or explicit root-scoped `data-role` hooks.
- [x] Replace implementation selectors in schema stories where accessible queries are practical.
- [x] Add an explicit visible-state assertion for each documented schema story mode: empty schema, sample schema, validation error, text mode, pairwise-ready enum schema, and command picker.
- [x] Replace generic option-panel interactions for important formats with format-specific checks that prove the right option maps to the right output payload.
- [x] Keep `playGenericApply` only as a fallback for low-risk generated option-panel stories.
- [x] Add Storybook interactions for high-risk option panels: CSV, DSV, JSON, JSONL, SQL, XML, Markdown, HTML, Python, JavaScript, and Jest.
- [x] Add docs text for any story whose default args do not clearly demonstrate the behavior being asserted.

## Phase 7: Selector Contract Hardening

Bring Storybook, component tests, and Playwright page objects into the same selector model.

Current progress:
- Audited the shared schema Playwright path and tightened it around one intentional page root plus component-level `data-role` hooks for reusable schema internals.
- `SchemaEditorComponent` now supports `rootSelector`-scoped schema hooks, and the generator/app schema page objects use that contract instead of per-control internal IDs.
- Matching hook coverage now exists in `shared-schema-definition-view.test.js` and the schema Storybook interactions, so component tests and browser abstractions exercise the same selector model.

- [x] Audit Playwright page objects for reusable-component internal IDs that are not intentional page contracts.
- [x] Replace component-internal ID selectors in page objects with role/name queries or component-level `data-role` hooks.
- [x] Keep fixed IDs only for page-level mount roots, third-party grid anchors, or documented legacy page contracts.
- [x] Add comments or docs for any retained fixed ID that is intentionally public.
- [x] Add component tests that use the same accessible names or `data-role` hooks expected by page objects.
- [x] Update `docs/frontend-component-architecture.md` with any retained public selector contracts.

## Phase 8: Storybook And Browser Verification Scripts

Make local verification match the migration rules more closely without making everyday development painfully slow.

- [x] Add a `verify:ui` script that runs lint, focused UI Jest, Storybook tests, Storybook build, and Playwright browser tests.
- [x] Decide whether `verify:local` should include `test:browser` or whether `verify:ui` should be the required gate for UI component work.
- [x] Update `AGENTS.md` after the script decision so future sessions run the right local command for UI work.
- [x] Consider a smaller critical Playwright smoke project for local component/page wiring checks if full browser tests are too slow.

## Phase 9: Legacy And Compatibility Cleanup

Reduce older compatibility surfaces now that component boundaries are clearer.

Current progress:
- The old `enableTestDataGenerationInterface` alias has been removed after confirming there were no live runtime consumers left in the repo; internal/runtime/public code now uses `mountTestDataGenerationPanel`.
- The hidden grid-engine selector and AG Grid compatibility runtime have been removed after confirming there was no product-facing AG Grid path beyond the old override-based selector.
- The only current page-facing primitive import in app-facing code is the dedicated primitive Storybook example, which is intentional documentation for the primitive itself rather than production page wiring.
- The remaining grid-header compatibility helpers now create DOM from injected or owner-document sources instead of global `document`.
- `Download` is now an injectable browser adapter with safe no-op behavior when DOM globals are unavailable.
- The app test-data entrypoint now resolves its document through the shared helper and safely no-ops when no browser-owned mount root exists.

- [x] Revisit `enableTestDataGenerationInterface` and decide whether it can be removed or formally documented as a public legacy alias.
- [x] Revisit data-grid compatibility wrappers around the main-grid bootstrap facade and document or remove remaining aliases.
- [x] Audit ag-grid legacy files for active references and either document why they remain or remove dead code.
- [x] Move any remaining page-facing imports away from low-level primitives when a shared presenter or feature component exists.
- [x] Add explicit follow-up todos for any legacy helper that still performs global DOM lookup internally.

## Tracking Notes

- This file is the active backlog for the architectural review comments.
- `docs/frontend-component-migration-plan.md` remains the historical migration plan and should not be reopened as a new phase list unless migration work resumes.
- `docs/frontend-component-architecture.md` should be updated when this plan changes the intended architecture or selector contracts.
- Keep new todos concrete and unchecked; avoid replacing action items with narrative-only notes.
