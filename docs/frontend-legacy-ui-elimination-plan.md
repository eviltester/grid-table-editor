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

- `packages/core-ui/js/gui_components/generator/runtime/create-generator-page.js`
  - The remaining live generator page seam is now the direct page factory plus its surviving page-service cluster, not the older shell/facade stack. Page creation flows through `create-generator-page.js`, orchestration lives in `generator-page-service.js`, mounted page assembly flows through `create-generator-page-runtime-mount.js` plus `create-generator-page-runtime-config.js`, and the live page-service path now uses flatter responsibility-based names such as `generator-page-actions-service.js`, `generator-page-view-state.js`, and `create-generator-page-schema-services.js` instead of the older page-config helper pyramid. The main remaining cleanup is narrower follow-up regrouping only if the surviving schema-generation helper or page orchestration still feels broader than one clear page boundary.
  - Generator page defaults now also use the generator-specific example schema as their sample text. `create-generator-page-defaults.js` imports `GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT` directly from `shared/test-data/schema/schema-examples.js`, while the embedded app path keeps `TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT` as its own sample-schema contract.

### Compatibility And Cleanup Candidates

- `packages/core-ui/js/gui_components/app/drag-drop-control.js`
  - Root-scoped drag/drop adapter. Keep it narrow and service-like rather than letting it absorb import workflow behavior.
- `packages/core-ui/js/gui_components/shared/modal-confirm.js` and `packages/core-ui/js/gui_components/shared/modal-text-input.js`
  - Document-level modal components used behind dialog services. Keep their remaining top-level overlay ID contract intentional and documented.
- `packages/core-ui/js/help/help-tooltips.js`
  - Shared tooltip bootstrap/service layer. The low-level service is now resolver-driven, and page bootstrap now scopes help-icon scanning to explicit page roots. The remaining intentional exception is the document-level inline-help registry contract.
- `packages/core-ui/js/gui_components/shared/theme-toggle.js`
  - Imperative page helper. It should become a small component or page-shell feature.
- `packages/core-ui/js/gui_components/shared/instructions/*`
  - Shared instructions now own explicit action hooks for page/bootstrap behavior. Keep app-specific instruction actions bound through component-owned action IDs rather than styling-class sniffing in page runtime or Storybook.
- `packages/core-ui/js/gui_components/shared/format-options-panel/*`
  - Format-option help now uses explicit option-help hooks. Keep the `option-help-icon` class as styling only, not as the private discovery or accessibility contract.
- `packages/core-ui/js/gui_components/shared/primitives/inline-message/index.js`
  - The shared primitive barrel should stay component-factory-only. `InlineMessageController` and `InlineMessageView` remain direct-import-only for focused primitive tests instead of broad barrel exports.
- `packages/core-ui/js/gui_components/shared/primitives/icon/icon-core.js`
  - The extra icon `index.js` pass-through barrel is gone. Keep the direct primitive module narrow around `renderIconHtml(...)`, `decorateIconContainer(...)`, and the low-level DOM-only `createIconElement(...)` helper used by focused primitive tests.
- The extra `packages/core-ui/js/gui_components/generator/options/index.js` pass-through barrel is gone. Focused coverage now imports `applyGeneratorFormatOptions(...)` directly from `apply-generator-format-options.js`, while output groups, language-subtask lists, lower-level sanitization/fan-out helpers like `sanitizeUiOptionsForFormat(...)` and `applySanitizedUiOptionsToTargets(...)`, framework-catalog conveniences like `TEST_FRAMEWORK_GROUPS`, `getTestFrameworkFormats(...)`, and `getTestFrameworkLabel(...)`, and the raw `OPTION_UI_SCHEMA_BY_FORMAT` definition map remain direct-import-only from `options-catalog-adapter.js` / `options-ui-schema.js` for internal definitions, parity checks, focused stories, low-level tests, and app/runtime assembly.
- `packages/core-ui/js/gui_components/app/import-export-toolbar/index.js`, `packages/core-ui/js/gui_components/app/text-preview-editor/index.js`, `packages/core-ui/js/gui_components/app/format-selector/index.js`, `packages/core-ui/js/gui_components/data-grid-editor/grid-toolbar/index.js`, and `packages/core-ui/js/gui_components/data-grid-editor/index.js`
  - Feature barrels should stay component-factory-only. Controller/view modules remain direct-import-only for focused tests instead of public barrel API.
- `packages/core-ui/js/gui_components/app/import-export-workspace/index.js`, `packages/core-ui/js/gui_components/app/population-actions/index.js`, `packages/core-ui/js/gui_components/app/population-mode-selector/index.js`, and `packages/core-ui/js/gui_components/app/data-population-panel/index.js`
  - Feature barrels should stay component-factory-only. Controller/view modules remain direct-import-only for focused tests instead of public barrel API.
- `packages/core-ui/js/gui_components/shared/instructions/index.js`, `packages/core-ui/js/gui_components/shared/schema-definition/index.js`, `packages/core-ui/js/gui_components/shared/row-count-control/index.js`, and `packages/core-ui/js/gui_components/generator/page/index.js`
  - Shared/page barrels should stay factory-first too. Keep only the live runtime entrypoints public, while controller/view modules, low-level parsing helpers, and page-specific preset data remain direct-import-only for focused tests and bootstrap assembly.
- The extra `packages/core-ui/js/gui_components/shared/test-data/help/index.js` pass-through barrel is gone. Runtime, Storybook, and focused coverage now import `getVisibleDomainCommands(...)` directly from `domain-command-provider.js`, while lower-level schema-help model/rendering helpers like `buildSchemaHelpModel(...)`, `renderSchemaHelpHtml(...)`, and `buildSchemaModeHelpHtml(...)` remain direct-import-only for focused schema/help internals and runtime composition.
- The extra `packages/core-ui/js/gui_components/shared/test-data/generation/index.js` pass-through barrel is gone. Runtime and focused coverage now import row-based generator creation and row-based pairwise eligibility directly from `generation-controller.js` and `ui-derived-state.js`, while preview/pairwise table builders plus lower-level runtime helpers like `createConfiguredGeneratorFromSchemaText(...)`, `createPreviewDataTable(...)`, `createPairwiseDataTable(...)`, `normaliseGeneratedCellValue(...)`, `normaliseGeneratedRow(...)`, `createTableFromGenerator(...)`, `parseNonNegativeCount(...)`, `createPairwiseTableFromGenerator(...)`, and `isPairwiseEligibleForDataRules(...)` remain direct-import-only for focused low-level coverage.
- The extra `packages/core-ui/js/gui_components/app/test-data-grid/generation/index.js` pass-through barrel is gone. Runtime assembly and focused coverage now import `createTestDataGenerationService(...)` directly from `test-data-generation-service.js`, while low-level amend/runtime helpers like `TEST_DATA_MODES`, `createAmendedTable(...)`, `createTableFromGenerator(...)`, and `normaliseCount(...)` remain direct-import-only from `test-data-amend.js` for focused controller wiring and low-level tests.
- The extra `packages/core-ui/js/gui_components/app/import-export-adapters/index.js` pass-through barrel is gone. Runtime assembly and focused coverage now import `createFileImportBindingsAdapter(...)` directly from `file-import-bindings-adapter.js`, while `createFileReadService(...)` remains a separate direct-import-only helper from `file-read-service.js` for workspace assembly and focused adapter coverage.
- The extra `packages/core-ui/js/gui_components/app/test-data-grid/index.js` pass-through barrel is gone. Live runtime code, focused tests, and harnesses now import `mountTestDataGenerationPanel(...)` directly from `controller/test-data-grid-controller.js`, while the non-runtime manager factory `createTestDataGenerationPanelManager(...)` remains direct-import-only from that controller module for focused stories and interaction harnesses.
- `packages/core-ui/js/gui_components/shared/test-data/schema/schema-controller.js` and `packages/core-ui/js/gui_components/shared/test-data/schema/schema-editor-core.js`
  - The extra shared-schema `index.js` pass-through barrel is gone. Runtime, Storybook, scripts, and focused coverage now import parsing from `schema-controller.js` and validation/spec helpers from `schema-editor-core.js` directly, while sample-schema examples plus schema-runtime helpers, schema error formatting, grid-row mapper helpers, editing-session constructors, command-spec parsing helpers, raw row-mutation helpers, schema-text rendering helpers, source-type/command row-mapper helpers, row-rendering/drag/drop helpers, low-level focus-state helpers, and deeper validation internals such as `TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT`, `GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT`, `parseSchemaText(...)`, `mapDataRuleToSchemaRow(...)`, `mapDataRuleToGridRow(...)`, `mapGridRowToSchemaRow(...)`, `schemaErrorsToText(...)`, `createSchemaEditingSession(...)`, `extractFakerCommandAndParams(...)`, `extractDomainCommandAndParams(...)`, `addSchemaRowAfter(...)`, `removeSchemaRowAt(...)`, `moveSchemaRow(...)`, `moveSchemaRowToIndex(...)`, `renderSchemaTextFromGridRows(...)`, `applySchemaSourceTypeChange(...)`, `applySchemaCommandSelection(...)`, `renderSharedSchemaRows(...)`, `handleSharedSchemaRowInputChange(...)`, `handleSharedSchemaRowButtonClick(...)`, `createSchemaRowValidation(...)`, `getSchemaRowValidationIssues(...)`, `getSchemaRowSemanticValidationIssues(...)`, `captureActiveFieldState(...)`, `restoreActiveFieldState(...)`, `getStaticSchemaRowValidationIssues(...)`, `annotateSchemaRowsWithValidation(...)`, and `collectSchemaRowValidationErrors(...)` remain direct-import-only for focused internals.

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

- Phase 1 blockers have been cleared. `ImportExportWorkspace` now owns the import/export behavior directly, and the old `ImportExportControls` / `ExportControls` runtime paths and Storybook shim path were deleted.

Active production blockers assigned to Phase 2:

- Phase 2 blockers have been cleared. The old `packages/core-ui/js/gui_components/options_panels/*` panel classes were replaced by declarative format option panel definitions under `shared/format-options-panel/`, and `FormatOptionsPanelView` now mounts definition-backed panels instead of adapting `panel.addToGui()`.

Active production blockers assigned to Phase 3:

- Phase 3 runtime blockers have been cleared. Shared schema row rendering, row actions, drag/drop handling, and tooltip behavior now live in the shared schema helper module, and the old `generator/schema/data-generator-schema-ui.js` wrapper has been deleted.

Active production blockers assigned to Phase 4:

- `packages/core-ui/js/gui_components/generator/runtime/create-generator-page.js` / `generator-page-service.js`: the old generator page coordinator gap is now much smaller, but the page-level orchestration cluster should still be re-audited if new behavior starts accumulating there again.
- `packages/core-ui/js/gui_components/generator/generation/data-generator-generation-actions.js`: the old page-level DOM-id parsing blocker has been cleared. Generation helpers now consume explicit row-count/runtime contracts and pairwise eligibility helpers, and row generation / pairwise / n-wise / buffered amend execution now flow through the shared `shared/test-data/generation/ui-generation-session-service.js` boundary used by both the app and generator shells. Remaining Phase 4 work is now limited to page-shell/runtime orchestration rather than duplicate generation execution paths.

Compatibility and grid work assigned to Phase 5:

Active adapters and shared helpers assigned to Phase 6:

- `packages/core-ui/js/gui_components/app/drag-drop-control.js` and `packages/core-ui/js/gui_components/app/import-export-adapters/file-import-bindings-adapter.js`: active drag/drop adapter path.
- `packages/core-ui/js/gui_components/shared/modal-confirm.js` and `packages/core-ui/js/gui_components/shared/modal-text-input.js`: imperative modal helpers wrapped by dialog services.
- `packages/core-ui/js/help/help-tooltips.js`: scoped help-tooltip lifecycle is now resolver-driven and root-scoped, and page bootstrap now passes explicit page roots into `initHelpTooltips(...)`. The remaining page-level concern is the global inline-help registry contract rather than whole-document help-icon scanning.
- `packages/core-ui/js/gui_components/shared/theme-toggle.js`: imperative page helper imported by app and generator startup.
- `packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.js`: document-level modal-style UI helper that should remain service-like or become component-backed.
- `packages/core-ui/js/gui_components/shared/test-data/ui/status-presenter.js`, `packages/core-ui/js/gui_components/shared/timed-error-display.js`, `packages/core-ui/js/gui_components/data-grid-editor/grid-error-surface.js`, and `packages/core-ui/js/gui_components/shared/primitives/inline-message/inline-message-view.js`: mostly accepted presenter/service or style-injection patterns, but they should stay documented as adapters rather than feature components.
- `packages/core-ui/js/gui_components/shared/page-startup-loading-status.js`: startup-status helper should stay resolver-driven and page-bootstrap-owned rather than carrying page-level loading-element ID lookup inside the shared helper.

Cleanup candidates assigned to Phase 7:

- Story/test-only marker matches under `packages/core-ui/src/tests/**` and `apps/web/src/tests/**`: these are not production blockers, but should be updated when their corresponding production legacy path is replaced.

Accepted page bootstrap or host-contract matches:

- `packages/core-ui/js/generator-script.js` and `packages/core-ui/js/gui_components/app/page/app-page-runtime.js`: page-level bootstraps may use documented mount-root IDs.
- Browser and interaction harnesses may use documented page-level IDs while treating the app as a black box.

Regression coverage note:

- Phase 0 did not delete or replace production behavior. The requirement is satisfied for this baseline by assigning every active production legacy path to a later phase with explicit required coverage. Before any later phase removes or replaces active production behavior, that phase must add or update regression coverage first, then keep the relevant browser, Storybook, and local verification gates green.

## Phase 1: Import/Export Workspace Behavior

Goal: remove `ImportExportControls` and `ExportControls` as behavior coordinators underneath the componentized workspace.

- [x] Define the final `ImportExportWorkspace` state model: selected format, preview/edit mode, preview row limit, auto-preview state, import busy state, export busy state, progress/status messages, text dirty state, active options, and supported import/export affordances.
- [x] Move preview/edit mode state and text dirty tracking into `ImportExportWorkspaceController` or a focused `TextPreviewEditorController` API.
- [x] Move preview rendering from grid/data table into an import/export preview service that receives exporter/importer dependencies explicitly.
- [x] Move text import and file import orchestration into services that return state transitions instead of mutating DOM.
- [x] Replace `ExportControls` with download/copy services plus component-owned busy/status rendering.
- [x] Replace `legacyControls.bindExistingGui(...)` with child components and injected services.
- [x] Remove `getImportExportControls()` from the public component API or replace it with intentional service-level accessors.
- [x] Update `ImportExportWorkspace` Storybook stories to use the real new behavior without injecting `ImportExportControls`.
- [x] Update export-format Storybook harnesses so they no longer instantiate `ImportExportControls` or patch document lookup.
- [x] Delete `import-export-controls.js` and `exportControls.js` after runtime, tests, and stories no longer import them.

Required coverage:

- Controller tests for preview row limits, mode transitions, dirty state, busy state, and status transitions.
- DOM/component tests for preview/edit mode, row count changes, import button state, copy/download controls, status rendering, and format changes.
- Browser tests for app import/export workflows, file import preview, full import, download, copy, and format-specific rendering.
- Storybook coverage for preview, edit, busy import, busy export, unsupported format, and error states.

Current status:

- `ImportExportWorkspace` now owns import/export state and behavior directly through its controller, view, and factory API.
- Preview rendering, row limiting, preview-then-import, clipboard, download, and yield-to-UI behavior live in `import-export-workspace-services.js`.
- `ImportExportToolbar` renders and binds root-scoped import/export actions using state/callback props instead of waiting for a broad legacy control to bind the DOM afterward.
- `TextPreviewEditor` exposes narrow text/copy callbacks and text helpers so the workspace can own dirty state and copy behavior without querying global document state.
- `import-export-controls.js`, `exportControls.js`, and the old export-actions adapter were deleted after runtime, tests, and stories moved to the component-owned path.
- The export-format Storybook harness now mounts `ImportExportWorkspace` directly, uses injected services for Storybook actions, and no longer monkey-patches `document.querySelector`/`getElementById`.
- `ImportExportWorkspaceView` now mounts its internal text-preview editor through a root-scoped `data-role` hook, leaving `#tabbedTextArea` only as a page/browser compatibility contract instead of a private implementation dependency.
- `ImportExportToolbarView` and the file-import bindings adapter now use root-scoped toolbar hooks for their private wiring (`set-text`, `set-grid`, download, file input, drop zone, and status surfaces), while the older child IDs remain only as page/browser compatibility contracts.
- `TextPreviewEditorView` now uses root-scoped hooks for its private format-selector roots, preview/edit toggle, auto-preview checkbox, help icon, preview textarea, and copy button wiring. The older child IDs remain only as page/browser compatibility contracts for the surrounding app workspace and browser layer.
- `TextPreviewEditorView` also no longer emits a default `previewRowsCount` input id in its live path. App-side tests and workspace flows now use the rooted preview row-count control or the visible `Preview row count` spinbutton by default, while explicit `inputId` overrides remain the shared row-count component's compatibility escape hatch rather than the app preview editor's default contract.
- `TextPreviewEditorView` no longer looks up its own internals through child-id or styling-class fallbacks in the live path either. Format roots, preview/edit controls, preview text, copy button, and layout roots now resolve only through the component-owned `data-role` hooks, leaving the older IDs and classes as outward page/browser or presentation contracts rather than private implementation dependencies.
- `TextPreviewEditorView` no longer emits default child ids for its format roots, preview/edit toggle, auto-preview checkbox, copy button, preview text area, or preview wrapper in the live path. App-side tests and workspace behavior now follow rooted hooks and accessible controls there too, while `#tabbedTextArea` remains the only import/export text-preview shell id still kept as a page-level compatibility anchor.
- `ImportExportWorkspaceView` no longer reaches into the text-preview editor by querying `.edit-area`, `.options-parent`, `.options-preview-splitter`, or `#markdown` directly. Those layout pieces now come through the `TextPreviewEditor` component API, so the workspace shell composes the child feature instead of traversing its internal DOM.
- `ImportExportToolbarView` no longer uses the styling class `.fileFormat` as a private behavior hook when it syncs the selected extension text. That internal update path now uses rooted `data-role="file-format-label"` hooks, leaving the class name as presentation-only.
- `FormatSelectorView` no longer uses `.conversionTypesList` or `.conversionSubtasksList` as its private behavior hooks. The component now renders rooted `data-role` list hooks for its main tabs and grouped subtasks, and the browser text-preview abstraction follows those rooted hooks instead of the old styling classes.
- `FormatSelectorView` now also resolves its mounted tabs list only through the rooted `data-role="format-tabs-list"` hook in the live path. The old `.conversionTypesList` class remains as presentation-only markup instead of a private fallback dependency.
- `FormatSelectorView` no longer uses `.type-select-action` or `.subtask-select-action` as its private click-binding contract either. Main-tab and subtask actions now expose rooted `data-role` hooks for the live behavior path, leaving those classes as presentation-only markup.
- `FormatSelectorView` also no longer emits generated `id="type-..."` attributes for its live main-tab items. The component now relies on rooted hooks and `data-tab-id` state instead of carrying another internal fixed-ID contract in the rendered path.
- `FormatSelectorView` now also exposes explicit rooted state hooks on its rendered tab and subtask items (`data-role="format-main-tab-item"` / `data-role="format-subtask-item"` plus `data-active-*` markers), and the old `data-subtask-id` / `data-types` payload on live subtask markup has been removed. Storybook and DOM coverage now follow those component-owned state hooks instead of CSS-state classes.
- `ImportExportToolbarView` and the file-import bindings adapter no longer carry live fallback queries for `#settextfromgridbutton`, `#setgridfromtextbutton`, `#filedownload`, `#csvinputlabel`, `#csvinput`, `#dropzone`, or the import/export status IDs. The live import/export toolbar path now binds only through rooted `data-role` hooks, while those older IDs remain as outward compatibility markup rather than private implementation dependencies.
- The shared `FormatOptionsPanel` path no longer treats the styling class `.apply-options` as a private behavior fallback. The live panel and generator/app consumers now resolve the Apply action only through `data-role="apply-options-button"`, leaving `.apply-options` as presentation-only markup.
- The app browser abstractions now also anchor the format-options panel and import/export extension label to rooted component hooks (`[data-role="options-panel-root"]`, `[data-role="file-format-label"]`) instead of `.options-parent` and `.fileFormat`, which keeps the Playwright layer aligned with the current import/export component contracts.
- The shared format-options panel and its Playwright abstraction now treat the Apply action as a rooted hook (`[data-role="apply-options-button"]`) instead of a styling-class contract. The `.apply-options` class remains for presentation, but dirty/apply behavior and browser interaction no longer depend on it.

## Phase 2: Format Option Panels

Goal: replace the old individual option panel classes with component-compatible format option definitions.

- [x] Define a standard format option panel contract with `render`, `read`, `write`, `validate`, `setDirty`, `destroy`, and `onApply` behavior.
- [x] Convert CSV and DSV first as proving slices because they exercise delimiter presets and custom values.
- [x] Convert JSON and JSONL next because they share structure but have mode differences.
- [x] Convert XML, SQL, Markdown, HTML, Gherkin, and ASCII panels.
- [x] Convert code-language panels: C#, Java, JavaScript, Kotlin, Perl, PHP, Python, Ruby, and TypeScript.
- [x] Convert unit-test framework panels.
- [x] Remove `HtmlDataValues` selector helper once panels read/write through controllers or scoped view helpers.
- [x] Replace `panel.addToGui()` usage in `FormatOptionsPanelView` with component or panel-definition mounting.
- [x] Keep option sanitization in services, not in view code.
- [x] Delete or retire old files under `packages/core-ui/js/gui_components/options_panels/` once converted.

Current status:

- Format options now render from declarative definitions in `packages/core-ui/js/gui_components/shared/format-options-panel/format-option-panel-definition.js`.
- `FormatOptionsPanelView` mounts definition-backed panels through `render`, `read`, `write`, `validate`, `setDirty`, `destroy`, and `onApply` behavior instead of adapting old `addToGui()` classes.
- CSV, DSV, JSON, JSONL, XML, SQL, Markdown, HTML, Gherkin, ASCII, all code-language panels, and all unit-test framework panels use the same shared contract.
- The old `shared/format-options-panel/base/index.js` and `shared/format-options-panel/code/index.js` convenience barrels were removed; `format-option-panel-definition.js` is now the single shared owner for core/code format order plus declarative definitions.
- The old `HtmlDataValues` selector helper and old `options_panels/*` implementation files were removed after production code and tests moved to the definition-backed shared component.

Required coverage:

- Controller tests for each materially different option family.
- DOM/component tests for validation, dirty/apply behavior, set-from-options behavior, and custom delimiter handling.
- Storybook stories for each format family with descriptions that explain defaults, limits, and expected applied payloads.
- Existing export-format browser coverage remains green.

## Phase 3: Shared Schema Definition Internals

Goal: make `SharedSchemaDefinition` genuinely shared, instead of a shared wrapper around generator-named DOM helpers.

- [x] Move schema row rendering out of `generator/schema/data-generator-schema-ui.js` into `SharedSchemaDefinitionView` or a dedicated shared schema rows view.
- [x] Move row input, button, command picker, drag/drop, and tooltip behavior behind shared controller/view methods.
- [x] Remove generator-specific IDs from shared internals except where passed as documented host contract props.
- [x] Replace `generator-schema-*` class names in shared internals with shared names, keeping compatibility classes only where styles or tests require a temporary bridge.
- [x] Make `buildSchemaModeHelpHtml(...)` either a shared service input or page-specific callback, not a reason for shared internals to import generator modules.
- [x] Delete unused exports from `generator/schema/data-generator-schema-ui.js`.
- [x] Delete `data-generator-schema-ui.js` entirely once only generator-specific schema-mode help copy remains and has been moved elsewhere.

Current status:

- Shared schema row rendering, drag/drop indicators, row input handling, row action handling, and tooltip-hiding helpers now live in `shared/test-data/schema/shared-schema-editor-ui.js`.
- `createSharedSchemaEditorController(...)` no longer imports any shared row behavior from a generator schema module.
- `shared-schema-editor-ui.js` no longer exports test-only schema key constants for runtime consumers; shared-schema DOM tests now own their local fixture IDs directly.
- `SharedSchemaDefinitionView` and shared schema row internals now emit shared schema class names alongside generator-era compatibility classes so shared code can stop depending only on generator naming.
- `SharedSchemaDefinition` no longer emits fixed child IDs by default. Shared schema internals now bind through root-scoped `data-role` hooks, and child IDs exist only when an app/generator host explicitly passes them as a documented compatibility contract.
- Shared schema controller/UI internals now use neutral schema element keys first, with generator-era ID fallbacks retained only as a low-level compatibility bridge.
- Generator runtime shared-schema composition now also passes only shared schema shell classes into `SharedSchemaDefinition`; the generator page keeps its host IDs, while generator-era shell class names remain only as CSS compatibility aliases instead of part of the shared component contract.
- Generator runtime shared-schema composition no longer passes generator-only IDs for the schema mode toggle, mode-help icon, or add-row button; those controls now rely on shared roles/default hooks, while the remaining generator host IDs stay limited to page-facing rows/text/error anchors.
- Shared schema default rendering no longer emits even shared-era child IDs like `sharedSchemaRows` or `sharedSchemaText`. Default component consumers now follow root-scoped hooks, while explicit generator/app host overrides still work where a page-level compatibility contract is intentionally preserved.
- Shared schema row helper behavior is now covered directly by shared tests rather than only through generator-facing compatibility tests.
- The old generator schema wrapper has been deleted. Schema-mode help markup is now built through the shared test-data help layer, and shared row helper behavior no longer flows through a generator-owned module at all.
- Generator runtime row-count parsing now prefers `GeneratorPreview` / `GeneratorControls` component APIs and only falls back to the lower-level shared parser as a compatibility bridge.
- Generator preview/generate workflows now request row counts through explicit `getPreviewRowCount()` / `getGenerateRowCount()` runtime contracts instead of routing through string ID dispatch like `parseRowCount('previewRowsCount')`.
- `GeneratorControlsView` and `GeneratorPreviewView` no longer re-read their own mounted row-count controls through internal input-id lookups when answering those runtime contracts. They now prefer the mounted `RowCountControl` component API directly, leaving the shared parser as a fallback bridge instead of the primary feature-owned path.
- The generator runtime itself no longer falls back to page-global row-count DOM IDs. If generator preview/controls components are unavailable, the runtime now returns an explicit invalid row-count result with reviewer-facing field labels; the old DOM-id parser survives only as a lower-level compatibility utility outside the main runtime path.
- Generator runtime selected-format and output-preview flows now prefer component/runtime state instead of directly reading `generatorOutputFormat` or writing `generatorOutputPreview` through document-global lookups.
- The generator runtime no longer keeps a separate `selectedOutputType` shadow copy. Current format now comes from `GeneratorControls` state/value, with `csv` only as the unmounted default.
- Generator pairwise-visibility calculation is now a pure helper result consumed by `GeneratorControls` state, instead of mutating `generateAllPairsButtonWrapper` directly from the generation helper layer.
- Shared row-count parsing now lives in `shared/row-count-control/row-count-control-parsing.js`; generator controls, generator preview, and the remaining legacy generator parser wrapper all reuse that one implementation instead of carrying separate parsing/error-message logic.
- The generator runtime no longer stores or orchestrates `formatOptionsPanel` / `optionsPanels`, and the old runtime-only options dirty-state helpers have been removed. The options panel lifecycle is now owned by `GeneratorControls` plus `FormatOptionsPanel`.
- Generator runtime now syncs current format/options state through an explicit `GeneratorControls.syncFormatState(...)` API, and the controls feature owns exporter-option lookup for selected format changes instead of relying on runtime-managed prop-shape updates.
- Post-apply format resync is now expressed as an explicit runtime intent (`syncGeneratorControlsFormatStateIfChanged(...)`) instead of inline format-difference checks scattered through apply flow orchestration.
- Apply-options orchestration now lives in `generator/options/apply-generator-format-options.js`, so the generator runtime delegates sanitize/apply/post-apply coordination instead of mixing exporter option mutation, controls resync, preview refresh, and status messaging inline.
- Shared schema definition now exposes `moveRowToIndex(...)`, allowing generator runtime to delegate row reordering to the shared schema feature instead of splicing rows and forcing schema render/text sync itself.
- Text-mode/schema-sync orchestration now lives in `generator/runtime/generator-schema-sync.js`, so the generator runtime delegates text-mode sync, semantic-validation, and schema-error surfacing coordination instead of keeping that flow inline.
- Shared schema definition now exposes `parseTextToRows(...)`, allowing generator runtime/tests to use the shared schema feature boundary instead of reaching directly into the page-owned schema session for parser access.
- Mounted shared schema state is now owned by `SharedSchemaDefinition`; the generator runtime no longer mirrors row/token/text-mode writes back into its private fallback schema session after mount, and stale runtime leftovers like `rowCountControls`, `invalidateSchemaTokensFromRows()`, and `handleGlobalButtonClick()` have been removed.
- The generator runtime no longer carries a broad set of dead schema passthrough methods for parser access, row actions, drag/drop handlers, or mode-update wrappers when production code already talks directly to `SharedSchemaDefinition`; generator-page coverage now exercises those behaviors through the shared schema feature boundary instead of the page runtime facade.
- `GeneratorPreview` now owns the current preview data table as component state; `DataGeneratorPage` no longer keeps a separate `lastPreviewDataTable` shadow copy or writes preview rows directly into the grid outside the preview component boundary.
- `GeneratorPreview` now also owns output-preview rendering from selected export type plus preview data table, and generator export/apply flows now call `GeneratorControls` status APIs directly instead of routing preview-text/status updates through extra `DataGeneratorPage` wrapper methods.
- Configured-generator creation and enum-column counting for generator preview/export flows now live behind a dedicated schema-generation service in `generator/generation/generator-schema-generation-service.js`, so `DataGeneratorPage` no longer owns that schema-to-generator orchestration method directly.
- Schema text-mode sync, schema revalidation, and schema-vs-generation error routing now live behind `generator/runtime/generator-schema-runtime-service.js`, so `DataGeneratorPage` no longer owns that validation/error coordination cluster directly.
- `DataGeneratorPage` no longer uses shared row-count parsing as a fallback runtime path; preview and generate row counts now come from `GeneratorPreview` / `GeneratorControls` component APIs, with only an explicit invalid-result fallback when those components are unavailable.
- Shared schema internals no longer need a duplicate generator-ID alias layer in addition to the neutral schema-key mapping supplied by `SharedSchemaDefinition`; generator page ids still work through the scoped controller/view contract, but the extra fallback ids were removed from the shared internals themselves.
- Shared schema internal behavior now uses shared-only row/container selectors, while generator-era row classes remain on the rendered markup only as outward compatibility hooks; internal focus, drag/drop, and row-action behavior no longer depends on mixed `.shared-*` / `.generator-*` selectors.
- Shared schema structural shell classes are now shared-only by default. Generator-era shell classes for rows/text/footer/head/error are supplied explicitly by the generator page host where they are still part of that page’s compatibility surface, instead of being baked into the shared component defaults.
- Shared schema sample-button handling and help-icon default help keys are now shared-only by default. Generator-specific schema help copy still comes from the generator host, but shared internals no longer listen for generator-only sample-button classes or default to the generator help token.
- Shared schema help/toggle wrapper markup now uses a shared default class and root-scoped behavior hook. The generator page explicitly adds `generator-button-with-help` only where it still needs generator-specific layout styling.
- Shared schema row help links now use shared help-link class and help-token defaults. Generator-specific help-link naming remains only as a CSS compatibility alias, not as the rendered shared default.
- Shared schema validation-state classes now use shared defaults for invalid rows, invalid fields, and row validation text. The old generator-era validation class aliases have been removed from the stylesheet because they are no longer emitted anywhere live.
- Shared schema row action and command-picker markup now use shared default classes. The old generator-era action/command-picker class aliases have been removed from the stylesheet because the shared renderer no longer emits them.
- Shared schema row layout and drag/drop state classes now use shared defaults. The old generator-era row-mode and drag/drop class aliases have been removed from the stylesheet because the shared renderer no longer emits them.
- Shared schema row root markup now renders `shared-schema-row` without the old `generator-schema-row` bridge class, and the matching generator-era row selectors have been removed from the stylesheet. App and generator harnesses/page objects now query the shared row contract directly.
- Shared schema shell styling now treats `shared-schema-heading`, `shared-schema-error`, `shared-schema-footer`, `shared-schema-rows`, and `shared-schema-text` as the primary selectors. Generator-era shell classes remain only as temporary styling aliases for current hosts.
- Reused generator-era wrapper/status classes are starting to move to shared-purpose names: generator controls/preview now use `shared-button-with-help`, and non-schema error surfaces such as grid-column/import-export errors now use `shared-inline-error-status`, with old generator names retained only as compatibility style aliases where still needed.
- The shared grid error surface no longer depends on the page-global `#grid-column-error` id in its live data-grid component path. `DataGridComponentView` now passes a rooted resolver for `[data-role="grid-error-status"]`, and the shared adapter itself no longer accepts a raw document-global lookup signature. The old id remains only as an explicit compatibility anchor for callers that intentionally pass `{ documentObj, elementId }`.
- The app test-data host no longer wraps the shared schema editor in a `generator-schema` shell or pass a generator-specific heading class. It now uses a shared-purpose shell class, reducing generator naming leakage into the app page host contract.
- Generator page controls/preview shells now emit shared-purpose class aliases such as `shared-generator-page`, `shared-generator-controls-head`, `shared-generator-options-wrapper`, `shared-generator-status-text`, `shared-generator-preview-head`, and `shared-generator-preview-controls`, with generator-era class names retained as compatibility aliases while the page contract is narrowed.
- Generator controls/preview section roots and reusable styling hooks now have shared-purpose aliases too: `shared-generator-controls`, `shared-generator-preview`, `shared-generator-options-panel`, `shared-row-count-label`, and `shared-file-action-icon`. The app preview editor now shares the row-count label hook instead of reusing the generator-specific one.
- Generator browser abstractions and smoke coverage now anchor to the shared-purpose generator shell aliases (`shared-generator-page`, `shared-generator-preview-head`) instead of the older generator-only class names.
- Generator page instructions and schema-mode help consumers now use shared-purpose help keys (`shared-generator-screen-overview`, `shared-schema-mode-help`) while the old generator help entries remain only as compatibility aliases in the shared help registry.
- Generator controls and preview help bubbles now also use shared-purpose help keys (`shared-generator-generate-data-help`, `shared-generator-pairwise-help`, `shared-generator-preview-help`) instead of generator-only tokens, with the older keys retained only as registry compatibility aliases.
- App and generator schema-mode help now share one `buildSchemaModeHelpHtml(...)` helper under `shared/test-data/help/`, with generator-specific docs-link copy passed as data instead of living in a generator-only help module.
- Generator controls, generator preview, and generator page instructions no longer duplicate tooltip HTML inline. Those components now rely on the shared help registry by key, removing a second source of truth for the same help content.
- `GeneratorPageView` no longer uses fixed IDs for its internal child mount points (`generatorControlsRoot`, `generatorPreviewRoot`, `generatorSchemaDefinition`). Those mounts now use root-scoped `data-role` hooks, while the real page-level contracts like `generatorSchemaSection`, `generator-app`, and `generator-instructions` remain intact.
- `GeneratorControlsView` and `GeneratorPreviewView` now use root-scoped `data-role` hooks for their own internal event binding and rendering lookups, while keeping existing element IDs in the markup only for external page/harness contracts such as output format, row-count inputs, preview output, and pairwise wrapper state.
- Shared schema row rendering and schema-mode help refresh no longer fall back to `window.updateHelpHints()`. The shared schema path now uses the explicitly injected `updateHelpHints` callback from `SharedSchemaDefinition`, which removes another hidden page-global dependency from shared UI behavior.
- Shared schema row rendering, schema-mode tooltip hiding, and drag/drop indicator cleanup now run through explicitly passed row-root/help-icon elements from the shared component boundary instead of resolving those targets through document-global key lookups inside the shared row helper module.
- `SharedSchemaDefinitionView` now attaches the mounted rows/text/buttons/help elements directly to the shared schema controller, so the shared schema editor no longer remaps neutral internal keys through a private ID alias map when the component boundary already owns the real element references.
- `SharedSchemaDefinitionView` now also binds its own mounted rows/text/buttons/help references back through the same root-scoped `data-role` hooks it renders, so shared view internals no longer use host IDs as their private mount wiring path.
- Generator schema error status no longer depends on the `#generatorSchemaErrorText` host ID. The generator page now binds transient schema-error status through the shared schema error element hook, and browser/Jest coverage follows the shared `data-role="schema-error"` contract instead of the generator-only ID.
- Generator runtime and generator page Storybook no longer pass generator-only row/text/text-container IDs into `SharedSchemaDefinition`. The live generator page now relies on the shared root-scoped schema hooks under `#generatorSchemaSection`, and generator-focused harnesses/tests follow those shared hooks instead of the old child IDs.
- The app bootstrap/runtime path now invokes only `mountTestDataGenerationPanel`, and the old `enableTestDataGenerationInterface` alias has been removed from the test-data-grid barrel/controller after confirming there were no live runtime consumers left in the repo.
- The unused app-side `createSchemaGridController(...)` wrapper was removed from `test-data-grid/schema/`; the active embedded-panel path already composes shared schema behavior through `createAppSchemaDefinitionProps(...)` plus `DataPopulationPanel`, so the stale document-lookup controller no longer survives as an exported compatibility surface.
- The embedded app test-data controller now accepts an explicit `RandExpClass`, and the app-page Storybook path injects that dependency directly instead of seeding `globalThis.RandExp` plus `eval` just to satisfy the embedded schema/generation flow.
- The export-preview Storybook harness no longer seeds unused `globalThis.RandExp` / `globalThis.faker` globals, and it no longer installs a `document.execCommand` copy shim now that the workspace story injects its own clipboard service.
- Generator runtime and generator-page Storybook now share one generator-specific schema-definition support helper for blank-row creation, rule-to-row mapping, method picker options, visible domain commands, schema-mode help wiring, and schema validation. That removes another block of duplicated schema feature assembly from `DataGeneratorPage`.
- Generator blank-row creation now also lives in `generator/schema-support/` through a dedicated row-factory helper, so `DataGeneratorPage` no longer owns the generator schema row shape or row-id incrementing logic directly.
- Mounted shared-schema state access and pre-mount schema-session fallback now live behind a focused generator schema state bridge, so `DataGeneratorPage` no longer owns the row/token/text-mode fallback rules or the small “render schema then refresh pairwise visibility” behavior directly.
- Generator controls/preview state plumbing now lives behind a focused runtime bridge, so `DataGeneratorPage` no longer open-codes selected-format lookup, row-count lookup, preview refresh, status updates, busy-state updates, and pairwise-visibility updates directly against mounted feature components.
- Generator page feature props/services/callback assembly now lives in a dedicated page-component config helper, so `DataGeneratorPage.init()` no longer hand-builds the large `createGeneratorPageComponent(...)` config object inline.
- Mounted generator-page feature hookup, exporter creation, and initial render/sync work now live behind a dedicated mounted-page bridge, so `DataGeneratorPage.init()` no longer hand-pulls mounted feature references or performs duplicate schema render steps inline.
- Generator schema-support creation, schema-session creation, and bridge bundle construction now live in a dedicated runtime-dependencies helper, so the `DataGeneratorPage` constructor no longer open-codes the large schema/runtime dependency assembly block inline.
- Generator page init/mount orchestration now also lives behind a dedicated runtime-mount helper, so `DataGeneratorPage.init()` no longer open-codes config assembly, page component creation, mounted-feature hookup, and initial render/sync sequencing inline.
- The remaining schema-runtime status callbacks and generator init preview/control setup now also route through that focused runtime bridge, and stale page-owned `previewTableApi` state has been removed from `DataGeneratorPage`.
- Pairwise-visibility calculation itself now lives behind the schema-generation service, so `DataGeneratorPage` no longer interprets schema rows directly when deciding whether the pairwise action should be exposed.
- Apply-options, preview-data, generate-data, pairwise-generate, and pairwise-visibility workflows now assemble through a dedicated generator runtime actions bridge instead of being composed inline inside `DataGeneratorPage` methods.
- The remaining public `DataGeneratorPage` methods are now a thin facade over focused bridges for schema state, view state, runtime actions, and mount-time composition; the old internal-only `setGenerationButtonBusy(...)` wrapper has been removed.
- The standalone generator bootstrap and generator interaction harnesses now use the public `createDataGeneratorPage(...)` factory directly instead of carrying a second mounted lifecycle path, so the remaining generator runtime shell is narrowing further to explicit mounted/unmounted helper surfaces rather than duplicated entry flows.
- Mounted generator-page Jest coverage now also prefers `createDataGeneratorPage(...)` for live runtime behavior, while the few explicit unmounted runtime assertions now use a dedicated runtime helper instead of constructing `DataGeneratorPage` directly through the public feature surface.
- The extra top-level `packages/core-ui/js/gui_components/generator/index.js` pass-through barrel is gone. Standalone bootstrap, focused harnesses, and generator runtime coverage now import `createDataGeneratorPage(...)` directly from `generator/runtime/create-generator-page.js`, while low-level schema-rule helpers continue resolving through `generator-schema-rule-helpers.js` and unmounted runtime assertions use the dedicated runtime helper rather than advertising extra generator internals as part of a broader feature entry surface.
- Pairwise-button visibility now updates through an explicit `GeneratorControls.setPairwiseVisible(...)` API instead of generic runtime `update({ pairwiseVisible })` prop mutation.
- Pairwise-button visibility state lookup now also routes through the generator schema-state bridge, so `DataGeneratorPage.updateAllPairsButtonVisibility()` no longer assembles ad hoc `{ rows, errors }` objects in its page facade.
- Schema-definition error/clear callbacks on the generator page now route through `generatorSchemaRuntime`, so shared schema callbacks no longer target missing page-level status helpers on `DataGeneratorPage`.
- Generation button busy state now lives in `GeneratorControlsController` state and renders through the controls view, rather than being treated as a view-only imperative toggle.
- Remaining Phase 3 work still includes deciding whether the now-test-only generator schema ID compatibility surface should be kept for explicit override coverage, and whether any remaining generator compatibility wrapper surface can be deleted entirely.

Required coverage:

- Shared schema controller tests for text/schema mode, parsing, semantic validation, command selection, row operations, and drag/drop instructions.
- DOM/component tests for rendered rows, row editing, command picker opening, row add/remove/move, text sync, sample insert, and help text.
- Storybook stories for app and generator schema variants using the same shared internals.
- Browser tests for app schema generation and generator schema generation stay green.

## Phase 4: Generator Runtime Slimming

Goal: reduce `DataGeneratorPage` to page runtime composition and move feature behavior into feature controllers/services.

- [x] Split generator generation orchestration into a feature controller or service that does not query page DOM for row counts or output text.
- [x] Make `GeneratorControls` the source of selected format, row counts, pairwise visibility, and generation busy/status state.
- [x] Make `GeneratorPreview` the source of preview text and preview grid state.
- [x] Move pairwise visibility calculation behind the schema/generation service boundary and update controls through props.
- [x] Remove fallback DOM reads from `DataGeneratorPage.getSelectedOutputType()`, `parseRowCount(...)`, and `applyCurrentTypeOptions(...)`.
- [x] Keep `DataGeneratorPage` responsible only for dependency construction, top-level composition, and lifecycle.

Required coverage:

- Unit tests for generation orchestration without DOM.
- Component tests for generator controls and preview state.
- Generator page Storybook stories using the new public component APIs.
- Browser tests for preview, generate file, pairwise generate, options apply, and schema mode switching.

## Phase 5: Grid Compatibility Decision

Goal: remove or migrate grid paths that keep old controls alive.

- [x] Decide whether AG Grid remains a supported runtime engine.
- [x] If AG Grid is not supported, remove `data-grid-editor/ag-grid/*`, AG Grid tests, and the grid engine selector path.
- [x] If AG Grid remains supported, wrap it behind the same `DataGridComponent` contract as Tabulator, or remove the unsupported engine path entirely.
- [x] Remove `GridControl` after AG Grid no longer uses it.
- [x] Replace `shouldEnforceUniqueColumnNames(documentObj)` with component state or an injected option from `GridToolbar`.
- [x] Update architecture docs to describe the final grid support policy.

Required coverage:

- Grid component controller/view tests for unique column-name behavior.
- Browser tests for the supported grid engine path.
- If multiple grid engines remain, tests that prove both use the same component-facing contract.

Current status:

- The app page bootstrap no longer instantiates `ExtendedDataGrid` directly, and it no longer routes through a Tabulator-only `createMainDataGrid(...)` shim. `app/page/app-page-runtime.js` now mounts the supported `createDataGridComponent(...)` path directly while injecting the Tabulator services it needs.
- The hidden grid-engine selector path has been removed. `data-grid-editor/main-display-grid.js`, `grid-engine.js`, AG Grid library-loading branches, and AG Grid runtime/test files were deleted after confirming there was no real product-facing AG Grid entry point beyond the old query/storage override path.
- Unique-column-name enforcement no longer reads the checkbox through `shouldEnforceUniqueColumnNames(documentObj)`. Both grid paths now read `uniqueColumnNames` from explicit controller state and injected callbacks.
- `GridControl` has been deleted. Its remaining useful behavior coverage now lives on `GridToolbarController` and `DataGridComponentController`, which are the real shared contracts used by both grid paths.
- The shared column-header action helper remains the single live path for grid header action buttons on the supported Tabulator grid; the old Tabulator popup helper and the removed AG Grid header path no longer duplicate that markup/wiring surface.
- The final supported runtime policy is now documented as Tabulator-only in the architecture docs, and the app runtime now consumes the component API directly instead of carrying a dedicated main-grid bootstrap facade.

## Phase 6: Shared Services And Page Helpers

Goal: narrow remaining imperative helpers so they are either component-backed services or accepted low-level adapters.

- [x] Convert confirm and text-input modals into component-backed services with explicit lifecycle and root ownership.
- [x] Convert help tooltips into a scoped service or component API that does not require document-wide scans from feature components.
- [x] Convert theme toggle into a shared component or page-shell feature.
- [ ] Keep download, file read, clipboard, drag/drop, timers, and Tabulator wrappers as adapters only if they do not own feature state or rendering.
- [x] Document every accepted adapter in `docs/frontend-component-architecture.md`.
- [ ] Remove service internals that still depend on global document state when an injected document/root is available.

Required coverage:

- Service tests for modal lifecycle, tooltip scoping, theme persistence, drag/drop cleanup, and download/copy behavior.
- Storybook stories for component-backed modal, tooltip, and theme surfaces where visible.
- Browser smoke coverage for modal and tooltip behavior in real pages.

Current status:

- Confirm dialog service now owns a component-backed dialog instance with explicit `requestConfirm()` and `destroy()` lifecycle, and the dead `showConfirmModal(...)` compatibility wrapper has been removed.
- Text-input dialog service now also owns a component-backed dialog instance with explicit `requestTextInput()` and `destroy()` lifecycle, and the dead `showTextInputModal(...)` compatibility wrapper has been removed.
- Help tooltips now expose a scoped `createHelpTooltipService(...)` API with explicit `update()` and `destroy()` lifecycle. Feature components can scope tooltip decoration and Tippy binding to their own root element instead of relying on a document-wide scan.
- `initHelpTooltips(...)` remains as the page-level bootstrap path and now returns the same service object without recreating a legacy `window.updateHelpHints` global hook.
- The scoped help-tooltip service now also resolves Tippy through injected `windowObj` / `tippyFn` instead of ambient `globalThis`, so its browser dependency follows the same explicit boundary as the rest of the service.
- The scoped help-tooltip service now also keeps its owned inline-help registry container on an explicit service path during tooltip-content resolution instead of re-finding `#inline-help-items` through document-global lookup after each update. The registry id remains as the page-level cleanup/bootstrap contract.
- Component-scoped `createUpdateHelpHints(...)` usage no longer creates or mutates the page-level `#inline-help-items` registry at all. Scoped features now keep their inline-help registry under their own root, while `initHelpTooltips(...)` retains the document-level container only for page bootstrap and cleanup compatibility.
- The low-level help-tooltip service no longer hard-codes `.helpicon[data-help]` scans inside its `update()` and `destroy()` lifecycle. It now consumes an explicit help-element resolver, leaving selector-based scans only in the page/bootstrap and scoped helper entrypoints rather than inside the shared service itself.
- Generic shared help triggers now also expose explicit `data-help-role` contracts (`help-icon` and `option-help-icon`), and the shared scoped resolver now discovers tooltip targets through those hooks instead of the styling class `.helpicon`.
- Theme toggle now exposes only the small `createThemeToggleComponent(...)` page-shell feature with explicit `getState()`, `toggleTheme()`, `setTheme()`, and `destroy()` lifecycle. App and generator bootstraps call that factory directly, so the old `initThemeToggle(...)` compatibility wrapper is gone.
- `docs/frontend-component-architecture.md` now includes an explicit accepted-adapter inventory covering download, clipboard/download/file-read helpers, drag/drop bindings, timer/startup helpers, method-picker modal, grid-library loading, grid/widget adapters, dialog services, help tooltips, and the theme toggle.
- Confirm and text-input dialog internals now also resolve focus scheduling through injected `windowObj` / `documentObj` instead of ambient global window access, which narrows another remaining service-level browser dependency behind the explicit dialog-service boundary.
- The import/export download-service path now preserves injected `documentObj`, `URLObj`, and `BlobCtor` all the way into the `Download` adapter instead of silently reconstructing that adapter from ambient globals.
- The low-level `Download` adapter itself now resolves `URL` and `Blob` from injected browser context before falling back to ambient globals, so direct adapter consumers follow the same explicit browser boundary as the service layer above it.
- The import/export file-read path now preserves the owner window’s `FileReader` through `createFileReadService(...)` instead of silently falling back to ambient global `FileReader` when the workspace already has resolved browser context.
- The low-level `createFileReadService(...)` adapter now also resolves `FileReader` from injected browser context before falling back to ambient globals, so direct adapter consumers follow the same explicit browser boundary as the workspace service layer above it.
- Shared schema semantic-validation debounce now resolves through an injected timer API instead of ambient `globalThis.setTimeout` / `globalThis.clearTimeout`, narrowing another remaining service/controller-level browser dependency inside the shared schema feature boundary.
- The Tabulator adapter mount loop now resolves deferred mount scheduling and cancellation through explicit injected browser callbacks instead of ambient global timers, so the grid wrapper follows the same explicit dependency boundary as the other accepted adapters.
- The import/export yield-to-UI helper now also resolves scheduling through explicit injected callbacks instead of ambient global timers, so the workspace service path keeps browser scheduling on the same explicit boundary as the other accepted adapters.
- The test-data grid status helper now exposes a scoped `createTestDataUiStatusService(...)` plus injectable `createYieldToUi(...)` scheduling, so presenter lookup and UI-yield behavior can stay on explicit document/window callbacks instead of ambient `document`, `requestAnimationFrame`, and `setTimeout`.
- The low-level shared status and timed-status presenters no longer re-find their target elements through `document.getElementById(...)` in the presenter layer itself. Resolver-based presenters are now the shared contract, while page/grid wrappers like startup loading status and grid-error surfaces own the remaining intentional id-based lookup at the wrapper boundary.
- The page-startup loading helper now resolves its working document through the shared document resolver and can bind from an injected root element instead of depending on its own ambient `document` fallback path.
- Generator controls status clearing now resolves through injected timer callbacks or the injected `windowObj` instead of ambient global timers, which narrows another remaining view-level browser dependency in the generator feature path.
- `GeneratorControlsView` no longer creates its status/loading presenters by rediscovering `#generatorStatusText` through document-global lookup in the live component path. It now resolves the mounted `[data-role="generator-status-text"]` surface from its own root, while the rendered id remains only as a compatibility contract for page-level consumers and tests.
- `GeneratorControlsView` and `GeneratorPreviewView` no longer re-parse their row-count textboxes from DOM hooks in the live component path. Both now read row counts only through the mounted shared `RowCountControl` API, which removes another leftover generator-local fallback around a feature that already has an explicit child component boundary.
- `GeneratorControlsView` and `GeneratorPreviewView` also no longer emit default `generateRowsCount` / `previewRowsCount` input ids in the live path. Generator tests and browser flows now use the rooted row-count controls or accessible spinbuttons by default, while explicit `rowCountInput` overrides remain available for compatibility and multi-instance coverage.
- The dead `parseGeneratorRowCount(...)` helper/export has been removed from the generator generation module. Row-count parsing now lives only on the mounted generator child components and the shared view-state bridge instead of surviving as an unused page-era document/id helper.
- `GeneratorControlsView` no longer emits default fixed ids for its output-format select, generate buttons, pairwise wrapper, or status surface. The live path now relies on rooted hooks and accessible controls there, while explicit `ids` overrides still cover compatibility and multi-instance scenarios that intentionally need those anchors.
- `GeneratorPreviewView` no longer emits default fixed ids for its preview button, output preview textarea, or preview grid. The live path now relies on rooted hooks, labels, and roles there, while explicit `ids` overrides still cover multi-instance and compatibility scenarios that intentionally need those anchors.
- The shared theme-toggle feature no longer emits or re-finds a default `#theme-toggle-button` id in its live path, and it no longer uses `.theme-toggle-container` as a private lookup contract either. The component now relies on rooted `data-role` hooks plus the visible button contract, leaving the styling classes as presentation markup only.
- The shared theme-toggle component also no longer knows about `.header` as an implicit host contract, and the app/generator bootstraps no longer carry that fallback either. The page-entry HTML and page stories now expose an explicit `[data-role="theme-toggle-host"]` contract, and the shared feature itself only accepts that rooted host or an injected host element.
- The import/export drag/drop helper no longer carries a class-style control surface in the live path. `createDragDropAdapter(...)` is now the runtime contract, `FileImportBindingsAdapter` injects that rooted adapter factory explicitly, and the adapter itself is limited to drop-zone event binding/CSS state plus forwarding the first dropped file.
- The shared confirm/text-input modal helpers now resolve their owned dialog/title/message/input/button elements through rooted `data-role` hooks inside the overlay subtree rather than fixed child-ID or styling-class queries. The document-level backdrop and button/input IDs remain as the intentional public dialog-host contract for cleanup and browser/page-object integration.
- The shared method-picker modal now exposes rooted hooks for its overlay, search field, tabs, list, detail panel, tiles, and command labels. Its own internals, Jest coverage, browser page object, and Storybook cleanup now follow those component-owned hooks instead of the old styling-class selectors, while the classes remain as presentation markup.
- The shared method-picker modal’s close/cancel/apply controls now also use explicit rooted `data-role` hooks instead of ad hoc `data-action` attributes, so the live modal contract is more consistently component-owned end to end.

## Phase 7: Dead Code, Stories, And Public API Cleanup

Goal: remove old files and old public shapes that only remain because tests or stories still reference them.

- [x] Delete `TabbedTextControl` after replacing or removing its tests.
- [ ] Remove Storybook harness monkey patches for document lookup.
- [ ] Remove test-only imports of old option panels once format option components replace them.
- [ ] Remove legacy aliases from public barrels unless there is a documented downstream compatibility requirement.
- [ ] Update Playwright page objects to use current role/name/component APIs after markup changes.
- [ ] Update `docs/frontend-component-architecture.md` so compatibility examples are current and rare.

Required coverage:

- Full Jest suite for deleted or replaced utilities.
- Storybook interaction tests for all updated stories.
- Browser tests for user-facing workflows touched by cleanup.

Current status:

- `TabbedTextControl` and its final test-only consumer were deleted after confirming there were no runtime or Storybook imports left. The app import/export flow now relies only on `ImportExportWorkspace`, `TextPreviewEditor`, and the dedicated export-preview harness path.
- The browser app-page abstraction no longer uses the stale `ImportExportControls` name. Its component file/class/property are now aligned to `ImportExportWorkspace`, so the black-box Playwright layer matches the current runtime feature boundary instead of preserving control-era vocabulary.
- The import/export Playwright abstraction now queries the main workspace actions by visible button names (`Set Text From Grid`, `Set Grid From Text`, `Download`) inside `#import-export-controls` instead of depending on the old button IDs for those core interactions.
- The browser app-page abstraction no longer uses the deleted `TabbedText` name either. Its component file/class/property are now aligned to `TextPreviewEditor`, and its root anchoring now follows the shared `data-role="text-preview-editor-root"` hook instead of the old `#tabbedTextArea` shell id. The id remains only as a page-level compatibility contract for now.
- The text-preview Playwright abstraction now also queries `Preview`/`Edit`, `Auto Sync`, and `Copy` through component-scoped role/name selectors, with the format subtasks anchored to the component root instead of old fixed child IDs.
- The app test-data Playwright abstraction now scopes its action buttons, mode radios, row-count input, progress status, schema error surface, and schema rows to the current panel root and shared/component-owned hooks instead of depending on `#testdata-status`, `.import-progress-status`, `#testdata-schema-error`, or `#testDataSchemaRows`. `PopulationActionsView` now exposes the embedded panel status through rooted `data-role="population-status"` while preserving the older status id/class as compatibility surface.
- The embedded app test-data browser layer no longer depends on the legacy `.testDataSchemaGui` styling class. `AppPageShellView` now exposes a rooted `data-role="test-data-panel-shell"` hook for the visible app-shell boundary, `DataPopulationPanelView` exposes `data-role="data-population-panel-root"` for the mounted inner feature root, and the Playwright test-data abstraction plus shared schema-editor browser helper anchor through those component-owned hooks while the old class remains as a presentation/compatibility alias.
- The app test-data Playwright abstraction no longer performs its own raw Tabulator schema-row lookup when selecting embedded schema-grid rows. That third-party row selection now flows through the shared `GridRendererComponent`, keeping one browser abstraction responsible for Tabulator row access in the embedded panel too.
- The import/export workspace Playwright abstraction now scopes its file-import label, file input, drop zone, import/export progress status, extension label, and inline error surface to rooted component hooks and current label/role contracts instead of depending on old child IDs or styling classes.
- The text-preview Playwright abstraction now reads the preview textarea through the rooted `data-role="preview-text-editor"` hook instead of the styling class on the textarea element.
- The app smoke coverage no longer redefines page readiness through raw child selectors like `#main-grid-view` or `.conversionTypesList`. It now boots through `AppPage` and checks the preview tabs through the existing text-preview component contract instead of duplicating selector-level readiness rules in the spec.
- The grid-editor Playwright abstraction now exposes its inline column-error surface through the rooted `data-role="grid-error-status"` hook instead of spreading the old `#grid-column-error` child ID or a shared CSS-class contract through browser specs.
- `GridToolbarView` now uses rooted `data-role` hooks only for its private toolbar controls, event delegation, and filter/unique-name wiring. The older child IDs remain only as page-level compatibility contracts for the app shell and any legacy consumers.
- The app grid Playwright abstraction and shared `GridRendererComponent` no longer hardcode the app page’s `#myGrid` selector for live grid access. They now anchor the main grid through the rooted `data-role="data-grid-root"` host hook, and the Tabulator fallback path resolves from the actual mounted grid root instead of the app-specific ID string.
- The remaining Tabulator row/editing selectors used by app browser tests now live behind `GridRendererComponent` helpers (`waitForRowEditor`, `selectRowRange`, `dragRowTo`) instead of being repeated directly in grid specs.
- `GridHeaderComponent` no longer duplicates Tabulator column-title scanning for header names/count/visibility. Those browser-layer checks now flow through the shared `GridRendererComponent`, so one abstraction owns that third-party header discovery surface.
- `GridHeaderComponent` also no longer resolves Tabulator header title/root structure on its own for filter and sort operations. Header-root discovery now flows through `GridRendererComponent`, so one shared browser abstraction owns both column-title and header-root lookup for the Tabulator widget surface.
- `GridHeaderComponent` no longer owns Tabulator header-filter input lookup either. Per-column and all-column filter inputs now flow through `GridRendererComponent`, which keeps the shared renderer responsible for the remaining third-party header/filter DOM structure.
- Grid header action-button visibility checks and responsive-layout grid visibility checks now go through the grid page objects (`GridHeaderComponent` / `GridEditorComponent`) instead of raw `#myGrid ...` selectors in specs.
- `GridEditorComponent` no longer reads Tabulator header-filter inputs directly. Header filter values/active-filter state now live behind `GridHeaderComponent`, which keeps one browser abstraction owning the header DOM details.
- The app browser abstractions now keep the confirm/text-input modal backdrop IDs only as page-level host anchors, while their modal actions and text entry use role/name queries instead of child IDs like `#confirm-modal-ok`, `#confirm-modal-cancel`, `#text-input-modal-field`, and `#text-input-modal-ok`.
- Confirm and text-input modal handling in the app browser layer now lives in shared page-object components (`ConfirmDialogComponent`, `TextInputDialogComponent`) instead of being repeated across grid and text-preview abstractions.
- Overlay-safe help-tooltip dismissal and keyboard button activation now live in one shared browser helper (`OverlaySafeActivationComponent`) instead of being duplicated between the shared schema editor abstraction and the app test-data panel abstraction.
- The generator preview browser abstraction no longer carries its own parallel Tabulator header/row/cell helper logic. Preview-grid column and row reads now reuse the shared `GridRendererComponent`, so one browser abstraction owns that third-party grid behavior across app and generator flows.
- The generator preview browser abstraction no longer carries its own one-off "grid stays read-only" Tabulator probing either. That edit-mode detection now lives on `GridRendererComponent`, so the shared browser grid boundary owns both data reads and non-editable grid assertions across app and generator flows.
- The generator smoke coverage no longer hard-codes readiness through `#generatorOutputFormat` or `#generator-preview-grid`. It now boots through the shared `GeneratorPage` page object and its component-facing locators, which narrows another stale generator child-ID dependency in the browser layer.
- The confirm-dialog and text-input-dialog stories no longer manually strip modal backdrops before or after render; they now rely solely on the centralized Storybook cleanup layer plus service `destroy()` lifecycle, which removes another pair of story-specific document hacks.
- The import-export toolbar and text-preview editor stories no longer probe `.tippy-box` nodes in `document.body` to prove their help affordances. They now assert against the components’ own help bindings (`data-help` / `data-help-text`) instead of body-scoped tooltip markup.
- The import/export workspace stories no longer probe `#markdownarea` directly. Those reviewer-facing stories now rely on the preview editor's accessible textbox name instead of a raw preview-textarea ID.
- The import/export Storybook setup layer now also uses the mounted `ImportExportWorkspace` component API for initial format switching, preview-row-limit state, auto-preview state, and preview-text reads instead of driving those initial states through raw child selector clicks and textarea mutations.
- The export-format Storybook interaction helpers now drive preview text, JSON option fields, the delimiter selector, and apply/set-grid actions through visible role/name queries instead of raw `#markdownarea`, old button IDs, or panel CSS selectors.
- The embedded test-data Storybook harness no longer writes schema errors through the old `#testdata-schema-error` child ID. It now follows the shared schema error hook (`[data-role="schema-error"]`) exposed by `SharedSchemaDefinition`.
- The shared-schema Storybook harness no longer relies on generated child IDs for schema error updates or initial text seeding. It now uses the rooted shared hooks (`[data-role="schema-error"]`, `[data-role="schema-textbox"]`) that the component exposes directly.
- The export-preview Storybook harness no longer wires its action logging through legacy preview child IDs like `#settextfromgridbutton`, `#previewEditModeButton`, `#autoPreviewCheckbox`, or `#copyTextButton`. It now attaches to the mounted workspace through visible button text and the `Auto Sync` label instead.
- The dead generator-side `createOptionsPanelsForParent(...)` helper has been removed from the public options surface. Shared `FormatOptionsPanel` plus declarative option definitions are now the only supported option-panel composition path, so the old pre-component bulk panel factory no longer survives as a compatibility export.
- The public import/export adapter surface no longer exports the dead `FileImportBindingsAdapter` class. Runtime and tests already use `createFileImportBindingsAdapter(...)`, so the class-style adapter survives only as private implementation detail behind the factory instead of as an extra public compatibility shape.
- The shared Tabulator adapter surface is now factory-only as well. `createTabulatorGridAdapter(...)` remains the supported contract for both the app grid and generator preview paths, while the internal `TabulatorGridAdapter` class no longer survives as a public export or generator preview re-export.
- The extra `data-grid-editor/shared/index.js` pass-through barrel is gone. Runtime and focused coverage now import `GuardedColumnEditWorkflow` and `GuardedColumnEdits` directly from their dedicated modules, while the tabulator-specific adapter remains a separate low-level module.
- The generator `controls/` and `preview/` feature barrels are component-factory-only now too. Their public surface keeps `createGeneratorControlsComponent(...)` and `createGeneratorPreviewComponent(...)`, while low-level controller/view modules and preview-grid helper wiring stay available only through direct module imports for focused tests instead of surviving as extra public barrel API.
- The generator page barrel is narrower now as well. It keeps `createGeneratorPageComponent(...)` public, while the lower-level `createGeneratorPageShellComponent(...)` helper resolves through `create-generator-page-shell-component.js` directly for bootstrap, Storybook, and focused shell coverage instead of surviving as another broad barrel export.
- The extra app `page/index.js` pass-through barrel is gone now as well. Runtime bootstrap, Storybook, and focused shell coverage import `bootstrapApp(...)` directly from `app-page-runtime.js`, while the lower-level `createAppPageComponent(...)` helper continues resolving through `app-page-shell.js` directly.
- The import/export adapters barrel is narrower now as well. It keeps `createFileImportBindingsAdapter(...)` public as the reusable file/drop binding adapter, while the lower-level `createFileReadService(...)` helper resolves through `file-read-service.js` directly for workspace assembly and focused adapter coverage instead of surviving as another broad barrel export.
- The extra shared test-data `ui/index.js` presenter pass-through barrel is gone. Status presenter consumers now import `status-presenter.js` directly, while the shared schema barrel remains as the narrower public parsing/validation surface and internal helpers such as `openMethodPickerModal(...)` and `createSharedSchemaEditorController(...)` resolve through direct modules instead of surviving as broader compatibility exports.
- The export-preview Storybook harness also no longer parses the active export format back out of `.type-select` / `.subtask-select` CSS state. Its action payloads now read the selected format through the mounted `ImportExportWorkspace` component state and only use `data-*` action metadata for the clicked format link itself.
- The format-selector Storybook story no longer fabricates `#selectorRoot` / `#subtasksRoot` child IDs just to mount the component. It now passes direct root-element references into `createFormatSelectorComponent(...)`, which keeps that Storybook harness aligned with the component API instead of the old selector-era setup pattern.
- The app-page Storybook harness no longer manually appends its returned root into `document.body` just to satisfy bootstrap timing. It now defers the real `bootstrapApp(...)` call until the next animation frame, so the story uses Storybook’s own mount lifecycle instead of a story-only document-body hack.
- The app-page Storybook harness also no longer reaches into the controller-internal test-data import path or checks for missing page chrome through raw `.header` / `#initial-load` selectors. It now imports the app test-data harness through the public barrel and verifies the absence of site chrome/loading through reviewer-visible text instead of fixed DOM internals.
- The shared status/loading/timed-status Storybook harnesses no longer fabricate generated element IDs just to mount presenter services. They now drive `createStatusPresenter(...)`, `createLoadingStatusPresenter(...)`, and `createTimedStatusPresenter(...)` through rooted resolver callbacks scoped to the story host instead of story-only ID plumbing.
- The old `createTestDataGridControl` public helper export has now been removed as well. Storybook and interaction harnesses use `createTestDataGenerationPanelManager(...)`, which keeps the remaining non-runtime app test-data helper surface aligned with the panel/component vocabulary already used by `mountTestDataGenerationPanel`.
- The old `enableTestDataGenerationInterface` alias has been removed from the app test-data-grid public surface after confirming it had no live runtime consumers beyond its own compatibility regression and docs.
- The extra app test-data controller pass-through barrel is gone. The top-level feature barrel now resolves `mountTestDataGenerationPanel(...)` directly from `test-data-grid-controller.js`, while `createTestDataGenerationPanelManager(...)` and `createTestDataGridActionAdapter(...)` stay direct-import-only helpers for focused stories, harnesses, and controller coverage instead of surviving as broader compatibility exports.
- The dead `buildAppSchemaModeHelpHtml` alias has been removed from the app test-data schema host-adapter module. The app-side story/runtime surface now exports only `createAppSchemaDefinitionProps(...)` there, which matches the actual shared schema-help ownership instead of preserving a redundant app-specific alias.
- The extra app `test-data-grid/schema/index.js` pass-through barrel is gone now too. Runtime code, Storybook, and focused coverage import the live command-catalog helpers directly from `test-data-command-catalog.js`, while schema text-sync helpers plus mutable command catalogs and story-only command-catalog conveniences like `createSchemaTextSyncState(...)`, `showSchemaError(...)`, `populateGridFromSchemaText(...)`, `bindSchemaTextareaSync(...)`, `initializeSchemaErrorDisplay(...)`, `FAKER_COMMANDS`, `getFakerCommands()`, `getDomainCommands()`, and `DOMAIN_COMMANDS` stay direct-import-only from their focused modules.
- The extra generator `schema-support/index.js` pass-through barrel is gone. Runtime, Storybook, and focused coverage now import `createGeneratorSchemaDefinitionSupport(...)` directly from `create-generator-schema-definition-support.js`, while `createGeneratorSchemaRowFactory(...)` stays direct-import-only for runtime assembly and focused low-level coverage instead of remaining another broad compatibility export.
- The extra shared `dialog-services/index.js` pass-through barrel is gone. Runtime, Storybook, and focused coverage now import `confirm-dialog-service.js` and `text-input-dialog-service.js` directly instead of keeping a second shared wrapper surface.
- The extra `packages/core-ui/js/gui_components/generator/generation/index.js` pass-through barrel is gone. Runtime assembly and focused coverage now import `createGeneratorSchemaGenerationService(...)` directly from `generator-schema-generation-service.js`, while low-level preview/export/pairwise action helpers such as `renderGeneratorOutputPreview(...)`, `previewGeneratorData(...)`, and `generateGeneratorDataFile(...)` stay direct-import-only from `data-generator-generation-actions.js` for runtime wiring and focused tests.
- The old document-bound `applyModeDefaultRowCount` helper/export and the last radio-group mode reader fallback are both gone from the live app test-data controller surface. Generation-mode and row-count defaults now flow only through the mounted `DataPopulationPanel` component API, with the default `new-table` mode kept as a controller-level fallback instead of a document query.
- The live app test-data schema config no longer injects any app-specific shared-schema child IDs. Schema rows, textbox, error surface, add button, mode toggle, mode help, and text-container behavior now all flow through rooted shared-schema hooks in the embedded app path instead of app-only child IDs.
- The embedded app test-data status service no longer depends on the legacy `#testdata-status` child id in its live runtime path. `createTestDataGenerationPanelManager(...)` now creates a scoped status service that resolves the mounted `[data-role="population-status"]` element from the embedded panel root, while the older status id remains available only as an explicit compatibility override for tests or page-level consumers that still reference it intentionally.
- The app-side component tests and focused interaction harnesses for the embedded test-data panel now treat the panel root, rooted action hooks, and visible `How Many?` row-count control as the primary contract. The older action/status child IDs remain only as explicit compatibility coverage where hidden-state or multi-instance id preservation is still the behavior under test.
- The shared `RowCountControl` no longer emits a fixed input id in its default path. The embedded app panel and reviewer-facing Storybook harness now rely on the visible `How Many?` control contract by default, while explicit `inputId` overrides remain available only where a host intentionally needs compatibility or multi-instance id coverage.
- The app test-data status helper itself now defaults to the rooted `[data-role="population-status"]` surface rather than carrying a live document-wide `#testdata-status` fallback.
- `DataPopulationPanelView` no longer carries the dead shell-id props `populationActionsRoot`, `generateCountControl`, or `populationModeSelectorRoot`, and its live default path no longer emits `#testDataSchemaDefinition` either. The embedded panel now mounts all child feature roots through rooted hooks by default, while `schemaDefinitionRoot` survives only as an explicit opt-in override for multi-instance or compatibility coverage.
- `PopulationActionsView` no longer emits `generatedata`, `generateallpairs`, `refreshtestdatapreview`, or `testdata-status` in its live default path. The embedded panel now exposes those controls and status surfaces through rooted hooks and accessible names by default, while the older ids survive only as explicit per-instance compatibility overrides.

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

