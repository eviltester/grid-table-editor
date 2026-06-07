# Frontend Component Architecture

This document records the component model after the frontend migration. Use it with `AGENTS.md` and `docs/frontend-component-migration-plan.md` when changing app, generator, Storybook, or browser-test code.

## Page Runtime And Shells

Page runtime modules own startup orchestration. They load grid libraries, create long-lived services, compose page-level components, bind page-only actions, and clean up on destroy.

- App runtime: `packages/core-ui/js/gui_components/app/page/app-page-runtime.js`
- Generator runtime: `packages/core-ui/js/gui_components/generator/runtime/create-generator-page.js`
- Public package entrypoints: `packages/core-ui/src/index.js`, `packages/core-ui/js/script.js`, and `packages/core-ui/js/generator-script.js`

The public generator feature API is factory-only: standalone generator bootstrap and integration harnesses use `createDataGeneratorPage(...)` directly. The generator controls and preview feature barrels now follow the same rule by exposing only `createGeneratorControlsComponent(...)` and `createGeneratorPreviewComponent(...)`; low-level controller/view modules stay direct-import-only for focused tests. The same is now true for the app/grid feature barrels around import-export toolbar, text preview editor, format selector, import-export workspace, population actions, population mode selector, data-population panel, grid toolbar, data-grid component creation, shared instructions, shared schema definition, shared row-count control, app page bootstrap, generator page creation, and the shared inline-message primitive: public barrels expose only their live runtime entrypoints, while controller/view modules, low-level parsing helpers, and page-specific preset data stay direct-import-only for focused tests and bootstrap assembly. The extra app `page/index.js` pass-through barrel is gone now too: runtime bootstrap, Storybook, and focused shell coverage import `bootstrapApp(...)` directly from `app-page-runtime.js`, while `createAppPageComponent(...)` stays direct-import-only from `app-page-shell.js`. The generator page shell helper is direct-import-only now too: runtime bootstrap, stories, and focused shell tests resolve `createGeneratorPageShellComponent(...)` from `create-generator-page-shell-component.js` instead of advertising that lower-level shell helper through the broader generator page barrel. The extra app `import-export-adapters/index.js` pass-through barrel is gone now too: runtime assembly and focused coverage import `createFileImportBindingsAdapter(...)` directly from `file-import-bindings-adapter.js`, while the lower-level `createFileReadService(...)` helper continues resolving through `file-read-service.js` directly for workspace assembly and focused adapter coverage. Shared test-data helper barrels are narrowing the same way: the extra `ui/index.js` presenter pass-through barrel is gone, the extra `shared/test-data/schema/index.js` pass-through barrel is gone, the extra `shared/test-data/help/index.js` pass-through barrel is gone, the extra `shared/test-data/generation/index.js` pass-through barrel is gone, and the extra `generator/options/index.js` pass-through barrel is gone too. Runtime, Storybook, scripts, and focused coverage now import shared schema parsing from `schema-controller.js` and schema validation/spec helpers from `schema-editor-core.js` directly, while sample-schema examples, schema-runtime helpers, grid-row mapper helpers, session/mutation helpers, command-spec parsing helpers, schema-text rendering helpers, source-type/command row-mapper helpers, row-rendering/drag-drop helpers, and deeper focus-state and validation internals remain direct-import-only. Runtime, Storybook, and focused coverage now import `getVisibleDomainCommands(...)` directly from `domain-command-provider.js`, while lower-level help rendering/model helpers such as `buildSchemaModeHelpHtml(...)`, `buildSchemaHelpModel(...)`, and `renderSchemaHelpHtml(...)` continue resolving through their dedicated modules instead of another broad barrel. Row-based generator creation and row-based pairwise eligibility now resolve directly from `generation-controller.js` and `ui-derived-state.js`, while preview/pairwise table builders and lower-level helpers such as `createConfiguredGeneratorFromSchemaText(...)`, `createPreviewDataTable(...)`, `createPairwiseDataTable(...)`, `normaliseGeneratedCellValue(...)`, `normaliseGeneratedRow(...)`, `createTableFromGenerator(...)`, `parseNonNegativeCount(...)`, `captureActiveFieldState(...)`, `annotateSchemaRowsWithValidation(...)`, `createPairwiseTableFromGenerator(...)`, and `isPairwiseEligibleForDataRules(...)` remain direct-import-only as focused low-level generation helpers. `applyGeneratorFormatOptions(...)` now resolves directly from `apply-generator-format-options.js`, while output-format groups, code/unit-test language subtask lists, lower-level sanitization/fan-out helpers like `sanitizeUiOptionsForFormat(...)` and `applySanitizedUiOptionsToTargets(...)`, framework-catalog conveniences like `TEST_FRAMEWORK_GROUPS`, `getTestFrameworkFormats(...)`, and `getTestFrameworkLabel(...)`, and the raw `OPTION_UI_SCHEMA_BY_FORMAT` definition map resolve through `options-catalog-adapter.js` / `options-ui-schema.js` for internal definition wiring, parity tests, focused stories/tests, and app/runtime assembly. The shared instructions barrel now follows that same rule too: it keeps only `createInstructionsComponent(...)` public, while `APP_PAGE_INSTRUCTIONS_PROPS` and `GENERATOR_PAGE_INSTRUCTIONS_PROPS` resolve through their dedicated modules for page runtime assembly, Storybook examples, and focused instructions coverage. The shared row-count barrel is factory-only now too: it keeps only `createRowCountControl(...)` public, while `parseRowCountInputElement(...)` resolves through `row-count-control-parsing.js` directly for focused parsing coverage and the remaining compatibility helpers. Shared primitive helpers are tightening too: the extra icon `index.js` pass-through barrel is gone, and runtime code now imports `renderIconHtml(...)` and `decorateIconContainer(...)` directly from `icon-core.js`, while low-level DOM-only `createIconElement(...)` remains available from that same focused primitive module for direct low-level tests. The extra top-level embedded app test-data feature barrel is gone now too: live runtime code uses `mountTestDataGenerationPanel(...)` directly from `controller/test-data-grid-controller.js`, while the non-runtime manager factory `createTestDataGenerationPanelManager(...)` resolves through that same controller module for focused stories, harnesses, and controller coverage. The extra embedded app test-data schema `index.js` pass-through barrel is gone now too: runtime, Storybook, and focused coverage import `identifyFakerCommands(...)`, `getVisibleDomainCommandOptions(...)`, and `getMethodPickerOptions(...)` directly from `test-data-command-catalog.js`, while schema text-sync helpers plus mutable command catalogs and story/test-only conveniences like `createSchemaTextSyncState(...)`, `showSchemaError(...)`, `populateGridFromSchemaText(...)`, `bindSchemaTextareaSync(...)`, `initializeSchemaErrorDisplay(...)`, `FAKER_COMMANDS`, `getFakerCommands()`, and `getDomainCommands()` stay direct-import-only from their focused modules. The extra embedded app `test-data-grid/generation/index.js` pass-through barrel is gone now too: runtime assembly and focused coverage import `createTestDataGenerationService(...)` directly from `test-data-generation-service.js`, while low-level amend helpers like `TEST_DATA_MODES`, `createAmendedTable(...)`, `createTableFromGenerator(...)`, and `normaliseCount(...)` remain direct-import-only from `test-data-amend.js` for focused controller/runtime assembly and low-level tests. The extra generator `schema-support/index.js` pass-through barrel is gone now: runtime, Storybook, and focused coverage import `createGeneratorSchemaDefinitionSupport(...)` directly from `create-generator-schema-definition-support.js`, while the low-level `createGeneratorSchemaRowFactory(...)` helper remains direct-import-only for runtime assembly and focused tests. The extra generator `generation/index.js` pass-through barrel is gone now too: runtime assembly and focused coverage import `createGeneratorSchemaGenerationService(...)` directly from `generator-schema-generation-service.js`, while preview/export/pairwise action helpers stay direct-import-only from `data-generator-generation-actions.js` for runtime wiring and focused low-level coverage. Pure generator schema-rule helpers now resolve through `generator-schema-rule-helpers.js` directly, while the runtime module itself only exposes the mounted runtime factory plus the explicit unmounted compatibility/testing helper for low-level runtime assertions.
Generator sample-schema defaults are split intentionally now too: the embedded app path keeps `TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT` as its sample-schema contract, while generator runtime and generator-focused coverage import `GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT` directly from `shared/test-data/schema/schema-examples.js` instead of aliasing the app/grid example through the broader shared schema barrel. The shared help barrel is narrower too: it keeps `getVisibleDomainCommands(...)` public for shared runtime composition, while `buildSchemaModeHelpHtml(...)` now resolves through `schema-mode-help-builder.js` directly for app/generator runtime assembly, focused tests, and Storybook docs.
The shared schema barrel is narrower now as well: it keeps only `parseSchemaTextToRows(...)`, `validateSchemaRows(...)`, `schemaRowsToSpec(...)`, and `schemaRowsToSpecWithTokens(...)` public. Helpers like `mapDataRuleToSchemaRow(...)` and `schemaErrorsToText(...)` now resolve through `schema-row-mapper.js` and `schema-error-text.js` directly for runtime wiring, stories, and focused tests instead of surviving as broader barrel exports.
The embedded app test-data feature no longer has extra mounted-entrypoint wrappers either: live runtime code, focused tests, and harnesses now resolve `mountTestDataGenerationPanel(...)` directly from `controller/test-data-grid-controller.js`, and both the old one-export top-level `app/test-data-grid/index.js` pass-through plus the older `controller/index.js` pass-through are removed.
The shared status presenter helpers no longer have a second pass-through barrel either: consumers now import `createStatusPresenter(...)` and `createLoadingStatusPresenter(...)` directly from `shared/test-data/ui/status-presenter.js`, and the old `shared/test-data/ui/index.js` wrapper has been removed.
The generator runtime entry is simpler now. `create-generator-page.js` owns the public generator page factory, `generator-page-service.js` owns the page-level orchestration, and mounted page assembly flows through `create-generator-page-runtime-mount.js` plus `create-generator-page-runtime-config.js`. The older `data-generator-page-runtime.js` file now exists only as a compatibility re-export. The earlier page-config helper pyramid has been flattened into those direct page-level modules, so the remaining generator cleanup work is no longer the old shell/facade/config stack; it is only the narrower follow-on simplification of any future page-service growth under `generator/runtime/`, as tracked in `docs/generator-runtime-simplification-map.md` and `docs/frontend-mvc-cleanliness-checklist.md`.

Page shell components own reusable functional scaffold only: instruction roots, feature mount roots, and any page-internal layout needed by those features. Host-app chrome such as site headers, navigation, analytics tags, and startup loading placeholders belongs in the app entry HTML or host runtime, not in `core-ui` shells. Shells should not reach into feature internals.

- App shell: `packages/core-ui/js/gui_components/app/page/app-page-shell.js`
- Generator shell: `packages/core-ui/js/gui_components/generator/page/create-generator-page-shell-component.js`

Storybook now documents those shell boundaries directly through standalone shell stories with explicit placeholder mount-root cards, so reviewers can inspect shell composition separately from the full app and generator runtime stories.

## Component Layers

Use these layers when deciding where a change belongs.

- Page components compose feature roots for a complete page view, for example `AppPage` and `GeneratorPage`.
- Feature components own one meaningful UI area, for example data grid editor, import/export workspace, format selector, schema definition, generator controls, generator preview, test-data population toolbar, and test-data generation panel.
- App and generator schema wrappers now share one `SchemaPanel` component under `shared/schema-panel/`. Generator config supplies the generator section styling plus timed schema-error presenter, while app config supplies the test-data schema edit-zone styling and existing schema error display through schema-definition props.
- `DataPopulationPanel` now composes `TestDataPopulationToolbar` plus the shared `SchemaPanel`, while `GeneratorPage` composes generator controls, preview, and the same shared `SchemaPanel` with generator host props.
- `ImportExportWorkspace` now composes `ImportExportToolbar`, `FormatSelector`, `TextPreviewEditor`, and the focused `OptionsPreviewSplitLayout` shell. `ImportExportToolbar` is now a thin visible host around three narrower MVC components: `ImportExportGridPreviewSyncControl`, `ImportExportImportControl`, and `ImportExportDownloadControl`. The workspace still owns import/export behavior and format-option panel lifecycles, while the split layout owns only the visible options-versus-preview shell, resizing, and width clamping.
- `ImportExportWorkspace` now delegates its async import/export orchestration into `create-import-export-workspace-runtime.js`, and that runtime further delegates behavior into two narrower services: `create-import-export-preview-workflow-service.js` for preview/edit/format state and `create-import-export-file-transfer-service.js` for file import/export/copy/download flows. `create-import-export-workspace-workflow-service.js` now composes those two services instead of remaining the single broad feature brain. The public component entrypoint is now mostly root/document resolution, while the runtime is mainly lifecycle and child-component wiring rather than the main feature brain itself.
- Shared components are reusable page-facing pieces, for example instructions, row count control, schema definition, format option panel, status presenters, and dialog services.
- Primitives are low-level building blocks under `shared/primitives/`; page and feature code should prefer a shared presenter or feature API over wiring primitives directly.
- Services and presenters wrap behavior without owning a full feature, for example timed status, loading status, dialog services, clipboard/download/file adapters, and grid-library loading.
- Adapters isolate third-party or browser-specific APIs, especially Tabulator, file reads, downloads, clipboard, timers, and dialogs.

## Component Shape

New or migrated interactive UI should normally use `Controller + View + createComponent`.

- Controllers own state transitions, validation, parsing, and emitted callbacks.
- Views own DOM rendering, root-scoped event binding, and cleanup.
- `createComponent` factories compose controller and view, inject services, and return a small public API.
- Reusable components should mount inside one explicit root and query within that root.
- Document-global lookup inside a reusable component is a bug unless it is an explicitly injected browser service concern such as page bootstrap, document head/style injection, or top-level modal host management.

For a repo-specific review checklist of what still counts as "clean MVC" versus an acceptable service/shell exception, see `docs/frontend-mvc-cleanliness-checklist.md`.

## Selectors And IDs

Fixed IDs are reserved for page-level mount roots and intentional legacy DOM contracts. Reusable component internals should prefer accessible labels/roles for user-facing controls, classes for styling, and root-scoped `data-*` hooks only when role/name queries are not practical.

Storybook interactions, component tests, Playwright tests, and Playwright page objects should use role/name queries first. If a page object must use a selector for a third-party widget such as Tabulator, keep that selector inside the page object/component abstraction rather than spreading it through specs.

Current intentional public selector contracts:

- App host startup and feature roots: `#initial-load`, `#main-grid-view`, `#import-export-controls`, and `#testDataGeneratorContainer`.
- Generator host startup and feature roots: `#generator-initial-load`, `#generator-page-root`, and `#generatorSchemaSection`.
- No app-specific embedded schema child-ID contract remains in the live app path.
  The embedded app schema now uses rooted shared-schema hooks for rows, textbox, schema error surface, add button, mode toggle, mode help, and text-container behavior instead of app-specific child IDs.
- Third-party grid anchors that remain page-level integration points: `#myGrid` and `#testDataSchemaGrid` when the host is exercising Tabulator-backed grids.
- Document-level dialog overlays: `#confirm-modal-backdrop`, `#confirm-modal-ok`, `#confirm-modal-cancel`, `#text-input-modal-backdrop`, `#text-input-modal-field`, `#text-input-modal-ok`, and `#text-input-modal-cancel`.
- Shared instructions actions now use rooted `data-role="instructions-action-button"` plus explicit `data-action-id` values for app-page behaviors such as copying instructions to the grid or loading sample data from inline help. Their legacy classes remain styling hooks, not behavior contracts.
- Generic shared help triggers now use explicit `data-help-role` hooks for tooltip discovery and accessibility labeling. Use `data-help-role="help-icon"` for normal help triggers and `data-help-role="option-help-icon"` for option-specific help, while `.helpicon` remains presentation-only markup.
- Shared format-option help icons now use `data-role="option-help-icon"` for option-specific tooltip/accessibility behavior. The `.option-help-icon` class remains a styling hook only.

These are not reusable-component internal selectors. Generator shared-schema internals now use the root-scoped shared hooks under `#generatorSchemaSection` instead of child IDs for rows/text/error. When possible, browser tests should still reach page contracts through page objects or service abstractions rather than using the raw ID in every spec.

## Storybook

Storybook is a review, documentation, and lightweight interaction-example layer. It is not the primary automated test layer.

- Each story should teach a real state or behavior mode.
- If a story visibly renders a child component, that child should behave for real unless the story visibly replaces it with a placeholder.
- Prefer role/name queries in `play` functions and assert the meaningful state the story is meant to demonstrate.
- Story defaults and docs should make the intended behavior easy to explore.
- Presenter stories should keep the API split explicit:
  - `StatusPresenter` is for persistent non-loading status such as completion, info, warning, or error messages.
  - `LoadingStatusPresenter` is for active in-progress work and should visibly keep the spinner/loading class.
  - `TimedStatusPresenter` is for transient auto-clearing feedback and should not be documented as a persistent status surface.
- When practical, presenter stories should include a destroy-and-remount example so reviewers can confirm lifecycle safety without reading Jest tests first.
- Storybook cleanup is centralized in `.storybook/preview.js`; stories may expose `root.__storybookCleanup`, and the global decorator will run that teardown before the next story and remove common body-level artifacts such as modals, method-picker overlays, tooltip poppers, and inline help containers.
- Prefer returning the story root directly instead of manually appending it to `document.body` unless the component behavior genuinely depends on top-level overlays or body-scoped positioning.
- Current intentional body-aware Storybook exception is the app page bootstrap story, because it still exercises document-scoped page/bootstrap behavior rather than a purely root-scoped component contract. Document-level overlay stories and interactions are also allowed to validate modal or method-picker behavior.

## Format Options

`FormatOptionsPanel` renders format-specific option panels from declarative definitions under `shared/format-options-panel/`. A format option panel definition owns the field schema and returns a panel object with `render`, `read`, `write`, `validate`, `setDirty`, `destroy`, and `onApply` behavior. The shared view mounts those panels directly; there is no separate legacy `options_panels/*` class layer or `addToGui()` adapter path.
The old generator-side `createOptionsPanelsForParent(...)` helper is also gone; public/runtime code now treats declarative definitions plus `createFormatOptionsPanel(...)` as the only supported option-panel composition path.
The old `shared/format-options-panel/base/index.js` and `shared/format-options-panel/code/index.js` convenience barrels are gone too. Core/code format order and definition ownership now live in `format-option-panel-definition.js`, while the per-format definition files remain direct-import-only internals.

Option sanitization remains in the generator/app options services, not in the view. The view reads user input into an explicit `{ outputFormat, options }` payload and the controller sends that payload through the injected sanitization service before emitting applied options.

## Test Layering

Use the smallest test layer that proves the behavior.

- Unit tests cover controller logic, parsing, validation, state transitions, helper functions, and emitted callback decisions.
- DOM/component tests cover rendered behavior, accessible UI, user-like interaction, cleanup, and component integration below full page level.
- Storybook interaction tests cover reviewer-facing examples and guard story drift.
- Playwright covers composed page workflows, real browser behavior, Tabulator integration, file/import/export paths, downloads, and cross-component wiring.

When component markup changes, update component tests and Playwright page objects together so tests keep describing user-facing behavior rather than stale internals.

## Compatibility Policy

Compatibility wrappers and legacy aliases should be rare. Keep them only when there is a documented public or downstream reason, mark them as legacy in code or docs, and move internal imports to component-oriented names first.

Current intentional compatibility examples:

- No named legacy compatibility aliases currently remain in the app test-data entry surface. Runtime/public code uses `mountTestDataGenerationPanel` directly, and the remaining non-runtime helper factory now uses the panel-oriented name `createTestDataGenerationPanelManager(...)` instead of the older `createTestDataGridControl(...)`. The old extra `controller/index.js` pass-through barrel is gone; the non-runtime manager factory and action adapter both remain direct-import-only helpers for focused stories, harnesses, and controller coverage. The adjacent schema barrel is narrower now as well: it keeps only the live embedded-panel schema helpers public, while mutable command arrays and story/test-only catalog getters stay on the direct command-catalog module instead of the broader barrel.

## Accepted Adapter Inventory

These modules are intentionally kept as adapters or service-like helpers rather than full `Controller + View + createComponent` features. They are acceptable only because they stay narrow, receive injected browser dependencies where practical, and do not own feature workflow state.

### Browser and file adapters

- `packages/core-ui/js/gui_components/shared/download.js`
  - Browser download adapter around `Blob`, `URL.createObjectURL`, and a temporary anchor element.
  - Acceptable because it performs only download transport and accepts injected `documentObj`, `URLObj`, and `BlobCtor`.
- `packages/core-ui/js/gui_components/app/import-export-adapters/file-read-service.js`
  - FileReader adapter used by import/export flows.
  - Acceptable because it only reads a file into text, emits progress/load/error callbacks, and does not mutate UI.
- `packages/core-ui/js/gui_components/app/import-export-workspace/import-export-workspace-services.js`
  - `createClipboardService(...)`, `createDownloadService(...)`, and `createYieldToUi(...)` are low-level browser adapters used by the workspace controller/service layer.
  - Acceptable because they isolate `execCommand('copy')`, downloads, and browser scheduling from the feature controller without owning format/import/export state.
- `packages/core-ui/js/gui_components/app/drag-drop-control.js`
    - DOM drag/drop adapter factory that attaches drop-zone listeners and forwards the first dropped file.
    - Acceptable because it owns only element event binding and CSS state for a drop zone, not import workflow decisions.
- `packages/core-ui/js/gui_components/app/import-export-adapters/file-import-bindings-adapter.js`
    - Small DOM binding adapter factory for the import file input and drop zone.
  - Acceptable because it only wires root-scoped DOM events to `onFileSelected(...)` and delegates actual drag/drop behavior to the rooted `createDragDropAdapter(...)` helper.

### Timers, startup, and document-level service helpers

- `packages/core-ui/js/gui_components/shared/unref-timeout.js`
  - Tiny timer adapter that calls `unref()` when supported.
  - Acceptable because it only wraps timer creation and does not manage UI state.
- `packages/core-ui/js/gui_components/shared/page-startup-loading-status.js`
  - Page bootstrap helper for the initial loading/failure status surface.
  - Acceptable because it is a page-runtime presenter helper, not a reusable feature component, and it delegates visible rendering to resolver-driven status presenter components while leaving page-level startup-element lookup to the app/generator bootstrap entry points.
- `packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.js`
  - Document-level modal/overlay helper for the schema method picker.
  - Acceptable because it is an explicitly document-scoped service-style helper with injected `documentObj`/`windowObj`, not a reusable embedded component.

### Grid and third-party adapters

- `packages/core-ui/js/gui_components/data-grid-editor/grid-library-loader.js`
  - Page-runtime adapter for injecting the supported Tabulator script/style assets into `document.head`.
  - Acceptable because grid-library loading is a top-level bootstrap concern rather than feature UI state.
- `packages/core-ui/js/gui_components/data-grid-editor/tabulator-grid-adapter.js`
  - Tabulator integration adapter used by the componentized data-grid feature.
  - Acceptable because it isolates the third-party widget lifecycle and scheduling hooks behind a component-facing API.

### Component-backed shared services

- `packages/core-ui/js/gui_components/shared/dialog-services/confirm-dialog-service.js`
  - Shared confirm dialog service backed by a dialog component instance.
  - Acceptable because it exposes a narrow promise API and owns only service lifecycle.
- `packages/core-ui/js/gui_components/shared/dialog-services/text-input-dialog-service.js`
  - Shared text-input dialog service backed by a dialog component instance.
  - Acceptable because it mirrors the confirm-service boundary: narrow API, explicit lifecycle, no feature-owned state.
  - The extra `shared/dialog-services/index.js` pass-through barrel is gone; runtime, Storybook, and focused coverage now import these service modules directly.
- `packages/core-ui/js/help/help-tooltips.js`
  - Shared help-tooltip bootstrap/service layer.
  - Acceptable because `createHelpTooltipService(...)` now consumes an explicit help-element resolver and scopes tooltip decoration/teardown to that owned element set, while `initHelpTooltips(...)` remains a page-bootstrap helper that receives an explicit page root and keeps only the document-level inline-help registry contract.
- `packages/core-ui/js/gui_components/shared/theme-toggle.js`
  - Shared page-shell theme-toggle feature with a component-backed API.
  - Acceptable because page bootstraps call `createThemeToggleComponent(...)` directly instead of mutating theme UI inline.
  - The shared component itself now expects an explicit host element or a rooted `[data-role="theme-toggle-host"]` contract. The page-entry HTML and page stories expose that host explicitly, so there is no remaining `.header` fallback in runtime code.

Modules in this section should stay narrow. If one of them starts coordinating feature rules, mutating sibling UI, or depending on broad document scans when a root/document is already injected, it should be promoted into a real component or feature controller instead of staying an adapter.

The extra `data-grid-editor/shared/index.js` pass-through barrel is gone now too. Runtime and focused coverage resolve `GuardedColumnEditWorkflow` and `GuardedColumnEdits` through their dedicated modules directly, while the tabulator-specific adapter remains a separate low-level module.

Current intentional browser-service and page-entry exceptions:

- `packages/core-ui/js/gui_components/app/test-data-grid/controller/test-data-grid-controller.js` is still a page-entry boundary, but it now resolves its document through the shared helper and safely no-ops when no browser-owned mount root exists.

## Grid Support Policy

- The supported runtime grid engine is now Tabulator only.
- `packages/core-ui/js/gui_components/app/page/app-page-runtime.js` mounts `createDataGridComponent(...)` directly and injects the supported Tabulator services explicitly.
- `packages/core-ui/js/gui_components/data-grid-editor/grid-library-loader.js` now loads only the Tabulator runtime assets.


