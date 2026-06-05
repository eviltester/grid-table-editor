# Frontend Component Architecture

This document records the component model after the frontend migration. Use it with `AGENTS.md` and `docs/frontend-component-migration-plan.md` when changing app, generator, Storybook, or browser-test code.

## Page Runtime And Shells

Page runtime modules own startup orchestration. They load grid libraries, create long-lived services, compose page-level components, bind page-only actions, and clean up on destroy.

- App runtime: `packages/core-ui/js/gui_components/app/page/app-page-runtime.js`
- Generator runtime: `packages/core-ui/js/gui_components/generator/runtime/data-generator-page-runtime.js`
- Public package entrypoints: `packages/core-ui/src/index.js`, `packages/core-ui/js/script.js`, and `packages/core-ui/js/generator-script.js`

Page shell components own reusable functional scaffold only: instruction roots, feature mount roots, and any page-internal layout needed by those features. Host-app chrome such as site headers, navigation, analytics tags, and startup loading placeholders belongs in the app entry HTML or host runtime, not in `core-ui` shells. Shells should not reach into feature internals.

- App shell: `packages/core-ui/js/gui_components/app/page/app-page-shell.js`
- Generator shell: `packages/core-ui/js/gui_components/generator/page/generator-page-shell.js`

## Component Layers

Use these layers when deciding where a change belongs.

- Page components compose feature roots for a complete page view, for example `AppPage` and `GeneratorPage`.
- Feature components own one meaningful UI area, for example data grid editor, import/export workspace, format selector, schema definition, generator controls, generator preview, and test-data generation panel.
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

- No named legacy compatibility aliases currently remain in the app test-data entry surface. Runtime/public code uses `mountTestDataGenerationPanel` directly, and the remaining non-runtime helper factory now uses the panel-oriented name `createTestDataGenerationPanelManager(...)` instead of the older `createTestDataGridControl(...)`.

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
  - DOM drag/drop adapter that attaches drop-zone listeners and forwards the first dropped file.
  - Acceptable because it owns only element event binding and CSS state for a drop zone, not import workflow decisions.
- `packages/core-ui/js/gui_components/app/import-export-adapters/file-import-bindings-adapter.js`
  - Small DOM binding adapter for the import file input and drop zone.
  - Acceptable because it only wires root-scoped DOM events to `onFileSelected(...)` and delegates actual drag/drop behavior to `DragDropControl`.

### Timers, startup, and document-level service helpers

- `packages/core-ui/js/gui_components/shared/unref-timeout.js`
  - Tiny timer adapter that calls `unref()` when supported.
  - Acceptable because it only wraps timer creation and does not manage UI state.
- `packages/core-ui/js/gui_components/shared/page-startup-loading-status.js`
  - Page bootstrap helper for the initial loading/failure status surface.
  - Acceptable because it is a page-runtime presenter helper, not a reusable feature component, and it delegates visible rendering to status presenter components.
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
- `packages/core-ui/js/help/help-tooltips.js`
  - Shared help-tooltip bootstrap/service layer.
  - Acceptable because `createHelpTooltipService(...)` now scopes tooltip decoration and teardown to an explicit root; only `initHelpTooltips(...)` remains page-bootstrap oriented.
- `packages/core-ui/js/gui_components/shared/theme-toggle.js`
  - Shared page-shell theme-toggle feature with a component-backed API plus bootstrap compatibility wrapper.
  - Acceptable because page bootstraps call a narrow component/service boundary instead of mutating theme UI inline.

Modules in this section should stay narrow. If one of them starts coordinating feature rules, mutating sibling UI, or depending on broad document scans when a root/document is already injected, it should be promoted into a real component or feature controller instead of staying an adapter.

Current intentional browser-service and page-entry exceptions:

- `packages/core-ui/js/gui_components/app/test-data-grid/controller/test-data-grid-controller.js` is still a page-entry boundary, but it now resolves its document through the shared helper and safely no-ops when no browser-owned mount root exists.

## Grid Support Policy

- The supported runtime grid engine is now Tabulator only.
- `packages/core-ui/js/gui_components/app/page/app-page-runtime.js` mounts `createDataGridComponent(...)` directly and injects the supported Tabulator services explicitly.
- `packages/core-ui/js/gui_components/data-grid-editor/grid-library-loader.js` now loads only the Tabulator runtime assets.
