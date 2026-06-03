# Frontend Legacy UI Elimination Plan

This plan tracks the remaining work needed to remove old UI control patterns from the frontend after the first component migration. The goal is a UI architecture that is framework-light today, but cleanly movable to React, Web Components, Lit, or another renderer later.

The earlier migration created many component boundaries. This plan is stricter: a feature is not complete while it still depends on an old control class, generator-specific DOM helper, document-scanning UI helper, or broad imperative coordinator for its core user behavior.

Use this document with:

- `docs/frontend-component-architecture.md`
- `docs/frontend-component-migration-plan.md`
- `AGENTS.md`

## Target Standard

The target frontend structure is still `Controller + View + createComponent`, but the standard for this cleanup is higher than the first migration pass.

- UI features expose a `createThingComponent(...)` factory with `update(...)`, `destroy()`, and `getState()` where state exists.
- Controllers own state transitions, validation, parsing, and orchestration. They are testable without a DOM.
- Views own rendering and root-scoped event binding. They query only inside their supplied root.
- Components receive services, adapters, callbacks, `documentObj`, and `windowObj` explicitly.
- Components communicate through callbacks, component APIs, or explicit services rather than by mutating sibling DOM.
- Browser APIs are isolated behind services or adapters: files, drag/drop, clipboard, downloads, dialogs, timers, tooltips, and third-party widgets.
- Fixed IDs exist only for page mount roots, documented host contracts, or compatibility windows with a removal plan.
- Storybook stories use real visible child behavior, small harnesses, and reviewer-facing descriptions.
- Tests query user-facing roles/names first, then root-scoped `data-*` hooks where roles are not practical.
- A migrated feature must have focused controller tests, DOM/component tests for rendered behavior, Storybook coverage, and page/browser coverage when the whole page workflow is affected.

## Anti-Patterns To Remove

These are the patterns this plan treats as legacy, even when they are hidden beneath componentized shells.

- Broad classes named `*Controls` that own rendering, DOM lookup, event binding, workflow state, and service calls in one object.
- `addHTMLtoGui(...)`, `addToGui(...)`, `addHooksToPage(...)`, or `bindExistingGui(...)` as the primary UI lifecycle.
- Component internals using `document.querySelector(...)` or `document.getElementById(...)` for reusable UI state.
- Reusable components depending on generator- or app-specific DOM helper modules for their core rendering.
- Storybook harnesses that monkey-patch `document.querySelector(...)` or `document.getElementById(...)` to make old code appear scoped.
- Individual option panels that render with `parent.innerHTML` and expose only ad hoc callbacks.
- Compatibility wrappers that remain because runtime code still consumes old public shapes rather than component APIs.

## Current Legacy Inventory

This inventory is the starting point. Update it as each phase discovers more work.

### Active Production Blockers

- `packages/core-ui/js/gui_components/app/import-export-controls.js`
  - `ImportExportControls` still coordinates preview/edit mode, import/export behavior, progress messages, format visibility, options layout, and preview row limiting underneath `ImportExportWorkspace`.
- `packages/core-ui/js/gui_components/app/exportControls.js`
  - `ExportControls` still binds download/copy behavior to fixed DOM selectors and updates status elements directly.
- `packages/core-ui/js/gui_components/options_panels/*`
  - Individual format option panels still use old `addToGui()` classes, direct root mutation, and ad hoc callback APIs, even though `FormatOptionsPanel` is component-shaped around them.
- `packages/core-ui/js/gui_components/shared/test-data/schema/shared-schema-editor-controller.js`
  - The shared schema component still imports generator-specific row render and event helpers.
- `packages/core-ui/js/gui_components/generator/schema/data-generator-schema-ui.js`
  - Generator-named DOM helpers still render shared schema rows and handle row interactions.
- `packages/core-ui/js/gui_components/generator/runtime/data-generator-page-runtime.js`
  - `DataGeneratorPage` still acts as a large page coordinator with many behavior methods that should be pushed into page/feature controllers or services.

### Compatibility And Cleanup Candidates

- `packages/core-ui/js/gui_components/app/tabbed-text-control.js`
  - Old import/export tabs control. It appears test-only after the `TextPreviewEditor` and `FormatSelector` migration and should be removed if no runtime/story consumer remains.
- `packages/core-ui/js/gui_components/data-grid-editor/main-display-grid.js`
  - Grid engine selector facade. Keep only while multiple grid engines remain an intentional runtime feature.
- `packages/core-ui/js/gui_components/data-grid-editor/tabulator/main-display-grid.js`
  - Compatibility facade around `createDataGridComponent(...)`. Remove once app runtime accepts the component API directly.
- `packages/core-ui/js/gui_components/data-grid-editor/ag-grid/*`
  - Legacy AG Grid path. Either migrate behind the same component standards or remove if AG Grid is no longer supported.
- `packages/core-ui/js/gui_components/data-grid-editor/gridControl.js`
  - Old grid toolbar and grid shell control still used by the AG Grid path; only `shouldEnforceUniqueColumnNames(...)` is used by the active Tabulator component path.
- `packages/core-ui/js/gui_components/app/drag-drop-control.js`
  - Imperative drag/drop helper. It can remain as an adapter only if it has a narrow service contract and no feature orchestration responsibilities.
- `packages/core-ui/js/gui_components/shared/modal-confirm.js` and `packages/core-ui/js/gui_components/shared/modal-text-input.js`
  - Imperative modal helpers currently wrapped by services. They should become component-backed services or be explicitly documented as service internals.
- `packages/core-ui/js/help/help-tooltips.js`
  - Global tooltip scanning service. It should become a scoped tooltip service or component API that does not require document-wide rescans for reusable components.
- `packages/core-ui/js/gui_components/shared/theme-toggle.js`
  - Imperative page helper. It should become a small component or page-shell feature.

## Phase 0: Baseline Audit And Tracking

Goal: make the remaining legacy surface explicit and measurable before refactoring.

- [x] Add this plan to the standard frontend reading list in `AGENTS.md` or the relevant contributor docs.
- [x] Add a short note to `docs/frontend-component-migration-plan.md` explaining that this plan supersedes the previous "complete" status for stricter legacy elimination.
- [x] Build a search checklist for legacy markers: `addToGui`, `addHTMLtoGui`, `addHooksToPage`, `bindExistingGui`, `document.querySelector`, `document.getElementById`, `parent.innerHTML`, `rootElement`, `legacy`, and old `*Controls` classes.
- [x] Classify each match as active production, active adapter, compatibility facade, Storybook-only, test-only, or dead code.
- [x] Add regression coverage before deleting or replacing any legacy path that still has production behavior.

Exit criteria:

- Every known legacy item is assigned to a phase below or explicitly documented as an accepted adapter.
- There is no "probably migrated" area without an owner or follow-up.

### Phase 0 Audit Checklist

Use these commands when refreshing the baseline. They intentionally include stories and tests in the first pass, then narrow to production/runtime files for classification.

```bash
rg -n "\b(addToGui|addHTMLtoGui|addHooksToPage|bindExistingGui|useThisGridFunctionality)\b" packages/core-ui/js apps/web/src packages/core-ui/src apps/web/src/tests
rg -n "\b(document|documentObj)\.(querySelector|getElementById)\b|parent\.innerHTML|rootElement|\blegacy\b" packages/core-ui/js apps/web/src packages/core-ui/src apps/web/src/tests
rg -n "class\s+\w*Controls?\b|new\s+\w*Controls?\b|\b\w*Controls?\s*=\s*new\b" packages/core-ui/js apps/web/src packages/core-ui/src apps/web/src/tests
rg -l "\b(addToGui|addHTMLtoGui|addHooksToPage|bindExistingGui|useThisGridFunctionality)\b|\b(document|documentObj)\.(querySelector|getElementById)\b|parent\.innerHTML|\blegacy\b|class\s+\w*Controls?\b|new\s+\w*Controls?\b" packages/core-ui/js apps/web/src/stories -g "*.js"
```

Last refreshed: 2026-06-03.

### Phase 0 Classification

Active production blockers assigned to Phase 1:

- `packages/core-ui/js/gui_components/app/import-export-controls.js`: active production legacy coordinator reached through `ImportExportWorkspace`.
- `packages/core-ui/js/gui_components/app/exportControls.js`: active export/copy/download control reached through the import/export adapter path.
- `packages/core-ui/js/gui_components/app/import-export-workspace/index.js`: component factory still creates and exposes `ImportExportControls` as `legacyControls`.
- `apps/web/src/stories/export-preview-story-harness.js`: Storybook harness still instantiates `ImportExportControls`, accesses `getImportExportControls()`, and patches scoped document lookup for export preview stories.

Active production blockers assigned to Phase 2:

- `packages/core-ui/js/gui_components/options_panels/*`: individual option panels still use `addToGui()`, `parent.innerHTML`, and panel-local DOM selectors.
- `packages/core-ui/js/gui_components/shared/format-options-panel/format-options-panel-view.js`: componentized wrapper still calls `panel.addToGui()` and adapts old panel instances.

Active production blockers assigned to Phase 3:

- `packages/core-ui/js/gui_components/shared/test-data/schema/shared-schema-editor-controller.js`: shared schema logic imports generator-specific row rendering and event helpers.
- `packages/core-ui/js/gui_components/generator/schema/data-generator-schema-ui.js`: generator-named DOM helper still renders shared schema rows and handles row interaction logic.

Active production blockers assigned to Phase 4:

- `packages/core-ui/js/gui_components/generator/runtime/data-generator-page-runtime.js`: large page coordinator still owns many feature behavior methods and fallback DOM reads.
- `packages/core-ui/js/gui_components/generator/generation/data-generator-generation-actions.js`: generation helpers still parse row counts and pairwise visibility through page-level DOM IDs.

Compatibility and grid work assigned to Phase 5:

- `packages/core-ui/js/gui_components/data-grid-editor/main-display-grid.js`: grid-engine selector facade.
- `packages/core-ui/js/gui_components/data-grid-editor/tabulator/main-display-grid.js`: compatibility facade around `createDataGridComponent(...)`.
- `packages/core-ui/js/gui_components/data-grid-editor/ag-grid/*`: legacy AG Grid path still uses old grid control wiring.
- `packages/core-ui/js/gui_components/data-grid-editor/gridControl.js`: old grid toolbar/shell control remains active through AG Grid, while `shouldEnforceUniqueColumnNames(...)` is still imported by the Tabulator component path.

Active adapters and shared helpers assigned to Phase 6:

- `packages/core-ui/js/gui_components/app/drag-drop-control.js` and `packages/core-ui/js/gui_components/app/import-export-adapters/file-import-bindings-adapter.js`: active drag/drop adapter path.
- `packages/core-ui/js/gui_components/shared/modal-confirm.js` and `packages/core-ui/js/gui_components/shared/modal-text-input.js`: imperative modal helpers wrapped by dialog services.
- `packages/core-ui/js/help/help-tooltips.js`: scoped update helper exists, but the service still scans `.helpicon[data-help]` and uses document-level help content.
- `packages/core-ui/js/gui_components/shared/theme-toggle.js`: imperative page helper imported by app and generator startup.
- `packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.js`: document-level modal-style UI helper that should remain service-like or become component-backed.
- `packages/core-ui/js/gui_components/shared/test-data/ui/status-presenter.js`, `packages/core-ui/js/gui_components/shared/timed-error-display.js`, `packages/core-ui/js/gui_components/data-grid-editor/grid-error-surface.js`, and `packages/core-ui/js/gui_components/shared/primitives/inline-message/inline-message-view.js`: mostly accepted presenter/service or style-injection patterns, but they should stay documented as adapters rather than feature components.

Cleanup candidates assigned to Phase 7:

- `packages/core-ui/js/gui_components/app/tabbed-text-control.js`: no runtime/story imports were found; only `packages/core-ui/src/tests/utils/tabbed-text-control-mode.test.js` imports it.
- `packages/core-ui/js/gui_components/app/test-data-grid/schema/test-data-grid-schema-grid-controller.js`: `createSchemaGridController(...)` appears unused internally, while `createAppSchemaDefinitionProps(...)` remains active. Re-audit before deleting because it is still exported.
- Story/test-only marker matches under `packages/core-ui/src/tests/**` and `apps/web/src/tests/**`: these are not production blockers, but should be updated when their corresponding production legacy path is replaced.

Accepted page bootstrap or host-contract matches:

- `packages/core-ui/js/generator-script.js` and `packages/core-ui/js/gui_components/app/page/app-page-runtime.js`: page-level bootstraps may use documented mount-root IDs.
- Browser and interaction harnesses may use documented page-level IDs while treating the app as a black box.

Regression coverage note:

- Phase 0 did not delete or replace production behavior. The requirement is satisfied for this baseline by assigning every active production legacy path to a later phase with explicit required coverage. Before any later phase removes or replaces active production behavior, that phase must add or update regression coverage first, then keep the relevant browser, Storybook, and local verification gates green.

## Phase 1: Import/Export Workspace Behavior

Goal: remove `ImportExportControls` and `ExportControls` as behavior coordinators underneath the componentized workspace.

- [ ] Define the final `ImportExportWorkspace` state model: selected format, preview/edit mode, preview row limit, auto-preview state, import busy state, export busy state, progress/status messages, text dirty state, active options, and supported import/export affordances.
- [ ] Move preview/edit mode state and text dirty tracking into `ImportExportWorkspaceController` or a focused `TextPreviewEditorController` API.
- [ ] Move preview rendering from grid/data table into an import/export preview service that receives exporter/importer dependencies explicitly.
- [ ] Move text import and file import orchestration into services that return state transitions instead of mutating DOM.
- [ ] Replace `ExportControls` with download/copy services plus component-owned busy/status rendering.
- [ ] Replace `legacyControls.bindExistingGui(...)` with child components and injected services.
- [ ] Remove `getImportExportControls()` from the public component API or replace it with intentional service-level accessors.
- [ ] Update `ImportExportWorkspace` Storybook stories to use the real new behavior without injecting `ImportExportControls`.
- [ ] Update export-format Storybook harnesses so they no longer instantiate `ImportExportControls` or patch document lookup.
- [ ] Delete `import-export-controls.js` and `exportControls.js` after runtime, tests, and stories no longer import them.

Required coverage:

- Controller tests for preview row limits, mode transitions, dirty state, busy state, and status transitions.
- DOM/component tests for preview/edit mode, row count changes, import button state, copy/download controls, status rendering, and format changes.
- Browser tests for app import/export workflows, file import preview, full import, download, copy, and format-specific rendering.
- Storybook coverage for preview, edit, busy import, busy export, unsupported format, and error states.

## Phase 2: Format Option Panels

Goal: replace the old individual option panel classes with component-compatible format option definitions.

- [ ] Define a standard format option panel contract with `render`, `read`, `write`, `validate`, `setDirty`, `destroy`, and `onApply` behavior.
- [ ] Convert CSV and DSV first as proving slices because they exercise delimiter presets and custom values.
- [ ] Convert JSON and JSONL next because they share structure but have mode differences.
- [ ] Convert XML, SQL, Markdown, HTML, Gherkin, and ASCII panels.
- [ ] Convert code-language panels: C#, Java, JavaScript, Kotlin, Perl, PHP, Python, Ruby, and TypeScript.
- [ ] Convert unit-test framework panels.
- [ ] Remove `HtmlDataValues` selector helper once panels read/write through controllers or scoped view helpers.
- [ ] Replace `panel.addToGui()` usage in `FormatOptionsPanelView` with component or panel-definition mounting.
- [ ] Keep option sanitization in services, not in view code.
- [ ] Delete or retire old files under `packages/core-ui/js/gui_components/options_panels/` once converted.

Required coverage:

- Controller tests for each materially different option family.
- DOM/component tests for validation, dirty/apply behavior, set-from-options behavior, and custom delimiter handling.
- Storybook stories for each format family with descriptions that explain defaults, limits, and expected applied payloads.
- Existing export-format browser coverage remains green.

## Phase 3: Shared Schema Definition Internals

Goal: make `SharedSchemaDefinition` genuinely shared, instead of a shared wrapper around generator-named DOM helpers.

- [ ] Move schema row rendering out of `generator/schema/data-generator-schema-ui.js` into `SharedSchemaDefinitionView` or a dedicated shared schema rows view.
- [ ] Move row input, button, command picker, drag/drop, and tooltip behavior behind shared controller/view methods.
- [ ] Remove generator-specific IDs from shared internals except where passed as documented host contract props.
- [ ] Replace `generator-schema-*` class names in shared internals with shared names, keeping compatibility classes only where styles or tests require a temporary bridge.
- [ ] Make `buildSchemaModeHelpHtml(...)` either a shared service input or page-specific callback, not a reason for shared internals to import generator modules.
- [ ] Delete unused exports from `generator/schema/data-generator-schema-ui.js`.
- [ ] Delete `data-generator-schema-ui.js` entirely if no generator-specific behavior remains.

Required coverage:

- Shared schema controller tests for text/schema mode, parsing, semantic validation, command selection, row operations, and drag/drop instructions.
- DOM/component tests for rendered rows, row editing, command picker opening, row add/remove/move, text sync, sample insert, and help text.
- Storybook stories for app and generator schema variants using the same shared internals.
- Browser tests for app schema generation and generator schema generation stay green.

## Phase 4: Generator Runtime Slimming

Goal: reduce `DataGeneratorPage` to page runtime composition and move feature behavior into feature controllers/services.

- [ ] Split generator generation orchestration into a feature controller or service that does not query page DOM for row counts or output text.
- [ ] Make `GeneratorControls` the source of selected format, row counts, pairwise visibility, and generation busy/status state.
- [ ] Make `GeneratorPreview` the source of preview text and preview grid state.
- [ ] Move pairwise visibility calculation behind the schema/generation service boundary and update controls through props.
- [ ] Remove fallback DOM reads from `DataGeneratorPage.getSelectedOutputType()`, `parseRowCount(...)`, and `applyCurrentTypeOptions(...)`.
- [ ] Keep `DataGeneratorPage` responsible only for dependency construction, top-level composition, and lifecycle.

Required coverage:

- Unit tests for generation orchestration without DOM.
- Component tests for generator controls and preview state.
- Generator page Storybook stories using the new public component APIs.
- Browser tests for preview, generate file, pairwise generate, options apply, and schema mode switching.

## Phase 5: Grid Compatibility Decision

Goal: remove or migrate grid paths that keep old controls alive.

- [ ] Decide whether AG Grid remains a supported runtime engine.
- [ ] If AG Grid is not supported, remove `data-grid-editor/ag-grid/*`, AG Grid tests, and the grid engine selector path.
- [ ] If AG Grid remains supported, wrap it behind the same `DataGridComponent` contract as Tabulator.
- [ ] Remove `GridControl` after AG Grid no longer uses it.
- [ ] Replace `shouldEnforceUniqueColumnNames(documentObj)` with component state or an injected option from `GridToolbar`.
- [ ] Update architecture docs to describe the final grid support policy.

Required coverage:

- Grid component controller/view tests for unique column-name behavior.
- Browser tests for the supported grid engine path.
- If multiple grid engines remain, tests that prove both use the same component-facing contract.

## Phase 6: Shared Services And Page Helpers

Goal: narrow remaining imperative helpers so they are either component-backed services or accepted low-level adapters.

- [ ] Convert confirm and text-input modals into component-backed services with explicit lifecycle and root ownership.
- [ ] Convert help tooltips into a scoped service or component API that does not require document-wide scans from feature components.
- [ ] Convert theme toggle into a shared component or page-shell feature.
- [ ] Keep download, file read, clipboard, drag/drop, timers, and Tabulator wrappers as adapters only if they do not own feature state or rendering.
- [ ] Document every accepted adapter in `docs/frontend-component-architecture.md`.
- [ ] Remove service internals that still depend on global document state when an injected document/root is available.

Required coverage:

- Service tests for modal lifecycle, tooltip scoping, theme persistence, drag/drop cleanup, and download/copy behavior.
- Storybook stories for component-backed modal, tooltip, and theme surfaces where visible.
- Browser smoke coverage for modal and tooltip behavior in real pages.

## Phase 7: Dead Code, Stories, And Public API Cleanup

Goal: remove old files and old public shapes that only remain because tests or stories still reference them.

- [ ] Delete `TabbedTextControl` after replacing or removing its tests.
- [ ] Remove Storybook harness monkey patches for document lookup.
- [ ] Remove test-only imports of old option panels once format option components replace them.
- [ ] Remove legacy aliases from public barrels unless there is a documented downstream compatibility requirement.
- [ ] Update Playwright page objects to use current role/name/component APIs after markup changes.
- [ ] Update `docs/frontend-component-architecture.md` so compatibility examples are current and rare.

Required coverage:

- Full Jest suite for deleted or replaced utilities.
- Storybook interaction tests for all updated stories.
- Browser tests for user-facing workflows touched by cleanup.

## Phase 8: Comprehensive Final Review

Goal: prove there is no remaining legacy UI approach that blocks future React or Web Component migration.

- [ ] Re-run the legacy marker audit from Phase 0 and classify every match.
- [ ] Search for old lifecycle names: `addToGui`, `addHTMLtoGui`, `addHooksToPage`, `bindExistingGui`, `useThisGridFunctionality`, and broad `*Controls` classes.
- [ ] Search for reusable component global DOM access: `document.querySelector`, `document.getElementById`, `documentObj.querySelector`, and `documentObj.getElementById`.
- [ ] Search for Storybook document monkey-patching and large harnesses.
- [ ] Confirm every feature component has controller, view, factory, lifecycle cleanup, Storybook docs, controller tests, and DOM/component tests.
- [ ] Confirm every accepted adapter is documented, narrow, injected, and free of feature orchestration.
- [ ] Confirm fixed IDs are only page-level contracts or documented temporary compatibility contracts.
- [ ] Review `docs/frontend-component-architecture.md` and remove stale compatibility exceptions.
- [ ] Review `docs/frontend-component-migration-plan.md` and mark the older migration as superseded by this cleanup where appropriate.
- [ ] Run `pnpm run verify:ui`.
- [ ] Run `pnpm run verify:local`.
- [ ] Run broader browser and Storybook gates when the final review includes UI or browser behavior changes: `pnpm run test:browser`, `pnpm run test:storybook`, and `pnpm run build-storybook`.

Exit criteria:

- No active production UI feature depends on a legacy control class or generator/app-specific DOM helper for reusable behavior.
- No reusable component performs global document lookup for its own internal UI.
- No Storybook story needs document monkey-patching to make a component appear scoped.
- Compatibility facades are removed or documented with explicit owners and removal criteria.
- The architecture docs describe the actual implementation rather than an aspirational state.
- The final verification gates pass.

## Working Rules

- Keep each phase small enough to review and verify independently.
- Prefer deleting legacy files after replacement rather than leaving compatibility shadows.
- Do not move behavior into React/Web Components yet; this plan prepares the architecture without changing framework.
- Update this document whenever new legacy work is discovered.
- Add unchecked follow-up items immediately when a phase reveals more work.
- Treat a feature as incomplete if the componentized shell still delegates core behavior to a legacy control.
