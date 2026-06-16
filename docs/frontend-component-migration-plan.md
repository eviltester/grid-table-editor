# Frontend Component Migration Plan

This is an internal engineering plan for moving the current plain JavaScript UI toward small, independently testable components while keeping the app framework-light. The target style is:

- `ThingController` for state, orchestration, validation, service calls, and emitted actions.
- `ThingView` for DOM rendering and user interaction inside one supplied root element.
- `createThingComponent` for wiring the controller and view into a small lifecycle API.
- Storybook stories for every component, with small harnesses as a quality signal.

This plan intentionally does not require React, Vue, Svelte, or Lit. The structure should make a future Lit migration possible by replacing `ThingView` with a Lit element while keeping controllers, services, and adapters stable.

## Status Note

The first component migration established the main page and feature component boundaries, but later review found that several componentized shells still delegate core behavior to older controls, DOM helpers, or compatibility facades. For the stricter goal of eliminating legacy UI approaches before a future React, Web Components, or Lit migration, use `docs/frontend-legacy-ui-elimination-plan.md` as the active follow-on plan. That document supersedes any "complete" status in this migration checklist where old UI orchestration still remains underneath a component boundary.

For the related test-layer cleanup needed after app/generator component sharing increased, use `docs/frontend-ui-matrix-rationalization-plan.md` to track reduction of redundant app-vs-generator UI matrix coverage.

## Goals

- Split the app and generator UIs into feature components that can be mounted independently.
- Make every component visible and usable in Storybook.
- Keep Storybook harnesses small enough that coupling is obvious when it appears.
- Move browser-facing code toward user-like interactions and rendered-state assertions.
- Isolate Tabulator, file APIs, clipboard, downloads, dialogs, timers, and other browser services behind adapters.
- Share schema-definition behavior between the app page and generator page.

## Non-Goals

- Do not rewrite the whole UI in a framework as part of this migration.
- Do not change the schema text format as part of componentization.
- Do not combine component refactors with broad visual redesign unless a task explicitly calls for it.
- Do not replace Tabulator while this migration is in progress.
- Do not make Storybook stories depend on large page-level bootstrap helpers as the long-term pattern.

## Component Contract

Each component should expose a small lifecycle API:

```js
function createThingComponent({
  root,
  props = {},
  services = {},
  callbacks = {},
  documentObj = document,
  windowObj = documentObj?.defaultView || window,
} = {}) {
  const controller = new ThingController({ props, services, callbacks });
  const view = new ThingView({ root, controller, documentObj, windowObj });

  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
      controller.destroy?.();
    },
    getState() {
      return controller.getState();
    },
  };
}
```

Component rules:

- A view owns exactly one root element.
- A view queries only inside its root, except for explicitly injected dialog or document services.
- A controller must be testable without a DOM.
- A component receives all dependencies through `props`, `services`, or `callbacks`.
- A component does not reach into sibling components.
- A component emits output through callbacks or `CustomEvent`, not by mutating external DOM.
- A component provides `destroy()` when it binds events, creates timers, creates a Tabulator instance, or registers global listeners.
- IDs inside reusable components must be scoped, generated, or avoided where possible.

## Storybook Standard

Every component should have at least one Storybook entry when introduced.

Storybook is not the primary automated test layer. It is the component review, documentation, and experimentation layer, with lightweight automated interaction examples where they help explain or protect an important state.

Storybook stories should:

- Mount the component with explicit props and fake services.
- If a story visibly renders a child component's real UI, that child should also use real behavior rather than stubbed internals.
- Only mock a child component when the story also replaces that child's visible UI with an explicit placeholder or abstraction.
- Include component-level docs that explain purpose, important states, and behavior modes.
- Exercise real user interactions where useful.
- Show important states, including empty, populated, validation/error, busy, and disabled states.
- Log component outputs through Storybook actions or a visible story-local output panel.
- Avoid patching `document.querySelector`, global IDs, or sibling components.
- Avoid manual state synchronization that should belong inside the component.

A small story harness should usually do only this:

```js
export function renderThingStory({ props = {}, services = {}, callbacks = {} } = {}) {
  const root = document.createElement('section');
  const component = createThingComponent({ root, props, services, callbacks });
  root.__storybookCleanup = () => component.destroy();
  return root;
}
```

If a story needs a large harness, treat that as migration feedback. The component is probably still too broad, too dependent on globals, or missing a clean service boundary.

## Testing Strategy

Use a layered testing model:

- Unit tests cover controllers, services, parsing, validation, state transitions, and edge cases without DOM.
- DOM/component tests cover component views, user-like interactions, rendered state, emitted callbacks/events, and accessibility-facing behavior.
- Storybook documents and demonstrates component states for human review and exploratory interaction.
- Storybook automated interaction examples should stay lightweight and representative, not exhaustive.
- Playwright covers composed page workflows, real browser behavior, Tabulator integration, file/import/export paths, and cross-component wiring.

Rule of thumb:

```text
If it is pure logic: unit test it.
If it is one component view: DOM/component test it.
If it is a component state humans need to inspect: Storybook it.
If it needs the whole app/browser stack: Playwright it.
```

## Target Hierarchy

Use this as a target map, not as a rigid folder mandate. Pages compose features. Features compose smaller components. Adapters isolate external systems.

```text
pages
  app
    AppPage
      DataGridEditor
        GridToolbar
        GridTable
          TabulatorGridAdapter
        GridHeaderControls
        GridRowControls
        GridFilterControls

      DataPopulationPanel
        PopulationModeSelector
        RowCountControl
        PopulationActions
        EmbeddedSchemaDefinition
          SharedSchemaDefinition

      ImportExportWorkspace
        ImportExportToolbar
        FormatSelector
        FormatOptionsPanel
        TextPreviewEditor
        FileImportControl
        DragDropImportZone
        DownloadControl
        ImportExportStatus

  generator
    GeneratorPage
      GeneratorSchemaDefinition
        SharedSchemaDefinition

      GeneratorControls
        RowCountControl
        OutputFormatSelector
        FormatOptionsPanel
        GenerateDataButton
        GeneratePairwiseButton
        GeneratorStatus

      GeneratorPreview
        PreviewControls
        RowCountControl
        OutputPreviewText
        PreviewDataGrid
          TabulatorGridAdapter

shared
  row-count-control
    RowCountControlController
    RowCountControlView
    createRowCountControl
```

## Naming and Folder Conventions

Use these conventions for shared component work unless a stronger local pattern already exists:

- Put shared reusable components under `packages/core-ui/js/gui_components/shared/<component-name>/`.
- Put lower-level UI foundations that are not intended as page-facing integration points under `packages/core-ui/js/gui_components/shared/primitives/<primitive-name>/`.
- Export the public component API from `index.js`.
- Name implementation files `<component-name>-controller.js` and `<component-name>-view.js`.
- Keep component tests under `packages/core-ui/src/tests/` with separate controller and view tests when both layers have meaningful behavior.
- Keep Storybook stories under `apps/web/src/stories/` until a different story colocation approach is intentionally adopted.
- Prefer kebab-case folder and file names, with PascalCase class names inside files.
- When a higher-level presenter or service boundary exists, prefer page/features consuming that API rather than importing the primitive directly.

## Current Code Anchors

The existing code already has useful partial boundaries:

- App bootstrap: `packages/core-ui/js/script.js`
- Generator page entrypoint: `packages/core-ui/js/gui_components/generator/runtime/create-generator-page.js`
- Generator shell and event binding: `packages/core-ui/js/gui_components/generator/host/`
- Generator generation actions: `packages/core-ui/js/gui_components/generator/generation/`
- App test-data panel host: `packages/core-ui/js/gui_components/app/test-data-grid/host/`
- App test-data controller: `packages/core-ui/js/gui_components/app/test-data-grid/controller/`
- Shared schema logic: `packages/core-ui/js/gui_components/shared/test-data/schema/`
- Existing Storybook harnesses: `apps/web/src/stories/storybook-harnesses.js`

## Migration Phases

### Phase 0: Establish Standards

- [x] Agree on the component contract in this document.
- [x] Create `RowCountControl` as the first small example component using `Controller + View + createComponent`.
- [x] Add Storybook stories for `RowCountControl`.
- [x] Add Jest tests for the `RowCountControl` controller and view.
- [x] Wire one existing row-count field to `RowCountControl` with minimal blast radius.
- [x] Document the naming and folder conventions in this file after the example lands.

Initial proving-slice scope:

- App test-data panel `generateCount` is the first integration target.
- [x] Generator row-count fields should follow after the component contract feels stable.
- Preserve current behavior while proving the new component shape, story shape, and test shape.

Current status:

- The app test-data panel `generateCount` field now uses `RowCountControl`.
- `RowCountControl` has Storybook coverage and focused controller/view Jest coverage.
- The generator generate/preview row-count fields now use the shared `RowCountControl`.
- Live generator behavior now reads those values through the mounted shared component API and visible row-count controls, while explicit `inputId` overrides remain available only for compatibility or multi-instance coverage.

### Phase 1: Small Shared Building Blocks

Why this phase comes next:

- `createStatusPresenter` is already shared between the app test-data panel and the generator page, but it still exists as a lightweight helper rather than a standardized component/service boundary.
- `TimedStatusDisplay` is already shared across generator schema errors, app schema text-sync errors, import/export errors, and grid column/header errors.
- These are good next candidates because they are small, visible, cross-cutting UI surfaces with real reuse, but they do not force us into a large feature extraction yet.
- Migrating them next helps establish a consistent pattern for injected status/error services before we tackle broader features such as `GeneratorControls`, `SharedSchemaDefinition`, or `FormatOptionsPanel`.

- [x] Convert `StatusPresenter` into a component-shaped API or adapter-compatible service.
- [x] Convert `TimedStatusDisplay` usage into an injectable timed-status service where practical.
- [x] Replace direct `new TimedStatusDisplay(...)` construction in import/export controls and grid error surfaces with the shared timed-status presenter/service boundary.
- [x] Wrap confirm and text-input modal usage behind services.
- [x] Create Storybook stories for status, timed status, confirm dialog, and text input dialog.
- [x] Ensure each story can mount without page bootstrap.

Current status:

- `createStatusPresenter` now delegates to the shared `InlineMessage` component while preserving the existing app and generator presenter API.
- The app and generator startup "Please Wait, Loading Libraries..." surfaces now adopt the shared status-presenter loading path during bootstrap, while keeping static HTML fallback text for pre-JS first paint.
- The shared status layer now distinguishes non-loading `createStatusPresenter(...)` flows from `createLoadingStatusPresenter(...)` flows so completion/status stories cannot be configured with loading-mode behavior by mistake.
- The non-loading `createStatusPresenter(...)` path now supports explicit `severity` (`normal`, `info`, `warning`, `error`) and optional dismissable statuses, so page-level completion and failure/status messages can share one honest API without reintroducing loading-mode configuration.
- `TimedStatusDisplay` now exposes a service-style `createTimedStatusPresenter(...)` boundary while keeping the legacy timed-error adapter available, so transient error/status surfaces and persistent status surfaces share one tested rendering/timing model.
- Import/export errors and grid column/header errors now use the shared timed-status presenter boundary rather than constructing their own message helpers or talking to the lower-level inline-message primitive directly.
- The lower-level `InlineMessage` implementation now lives under `shared/primitives/inline-message/` to signal that page/features should usually prefer the presenter/service APIs above it.
- `InlineMessage` has Storybook coverage for status-loading, timed auto-clear, and sticky warning modes, plus focused controller/view adapter tests.
- Confirm and text-input modal usage now flows through shared dialog services rather than direct modal helper imports at call sites.
- Storybook now documents the service-level APIs for status presenter, timed status presenter, confirm dialog, and text-input dialog with small reviewer-facing harnesses.

### Phase 2: Format Options Components

- [x] Create a shared `FormatOptionsPanel` feature with controller/view/component factory.
- [x] Move option-panel selection and dirty/apply state out of page-level controllers.
- [x] Wrap existing individual option panels so they can be mounted in Storybook independently.
- [x] Add stories for CSV, delimited, JSON, JSONL, SQL, XML, HTML, Markdown, ASCII, code, and unit-test code options.
- [x] Keep exporter/importer option sanitization in service functions, not view code.
- [x] Expand the new shared `FormatOptionsPanel` Storybook coverage from the initial CSV/DSV/JSON slice to the remaining formats.
- [x] Add remaining `FormatOptionsPanel` stories for ASCII and representative code-language panels so the story set covers all major format families, not only core and unit-test examples.
- [x] Add at least one additional representative code-language story beyond Python when a second code-family panel reveals materially different option behavior.

Current status:

- The shared `FormatOptionsPanel` now lives under `shared/format-options-panel/` with a controller, view, and create-component factory.
- Generator `renderOptionsPanelForSelectedFormat()` now delegates to the shared component instead of owning the dirty/apply wiring directly.
- App import/export options now delegate panel rendering and dirty/apply state to the shared component while keeping existing splitter/layout behavior outside the component boundary.
- Storybook coverage now exists for CSV, DSV, JSON, JSONL, SQL, XML, Markdown, HTML, ASCII, Python, and a representative unit-test framework panel (`Jest`) using the shared component with a small harness.
- Storybook now presents one `Format Option Panel` family, split into `Basic`, `Code`, and `Code Unit Test`, so each format appears once through the shared component boundary rather than being duplicated as separate shell and direct variants.
- Exporter/importer option sanitization now flows through shared options services, so page/controller code no longer owns the sanitization logic directly and the view layer remains free of catalog-normalization behavior.

Phase 2 exit note:

- The format-options migration slice is now complete enough to stop treating options as a special case and move on to broader feature extraction.

### Phase 3: Shared Schema Definition

- [x] Create `SharedSchemaDefinitionController`.
- [x] Create `SharedSchemaDefinitionView`.
- [x] Create `createSharedSchemaDefinitionComponent`.
- [x] Use existing shared schema logic from `shared/test-data/schema/` rather than duplicating it.
- [x] Add stories for empty schema, sample schema, validation errors, text mode, grid mode, command picker, and pairwise-capable enum schema.
- [x] Migrate the app-page schema editor host adapter onto the shared component while preserving the existing schema field IDs and generation contract.
- [x] Migrate the generator runtime schema editor from duplicated page/controller methods onto the shared component boundary.
- [x] Remove the now-redundant generator-specific schema rendering/event helpers after the generator runtime adopts the shared component.

Current status:

- `SharedSchemaDefinition` now lives under `shared/schema-definition/` with a controller, view, and create-component factory.
- The new component reuses the existing shared schema parsing, validation, row-editing, command-picker, drag/drop, and text-mode logic from `shared/test-data/schema/` instead of duplicating those rules.
- The shared schema row editor now also exposes a documented params-edit dialog for commands with parameter metadata, so app and generator hosts share the same guided param-entry flow and semantic validation path instead of leaving params as raw punctuation-only text entry.
- The shared params-edit dialog now normalizes command metadata so optional/defaulted params stay visibly optional, shows reviewer-facing `Req` checkboxes instead of text labels, and auto-quotes string values while keeping the dialog focused on value entry rather than quote-format selection.
- The app test-data panel now mounts its schema editor through `SharedSchemaDefinition`, keeping the same DOM IDs so the rest of the app flow and browser tests continue to treat the schema surface as a black box.
- The generator page now also mounts its live schema editor through `SharedSchemaDefinition`, while preserving the page-level `#generatorSchemaSection` host contract, row-level browser interactions, and text-mode generate/pairwise flows.
- Generator runtime adoption also moved the shared text-mode syncing, method-picker command selection, semantic-validation caret preservation, and pairwise-button visibility behavior onto the shared component path.
- `SharedSchemaDefinition` no longer emits fixed child IDs by default. Shared consumers now bind through root-scoped schema hooks, while app/generator hosts can still opt into explicit child IDs only where a documented compatibility contract truly requires them.
- Storybook now documents the shared component directly with empty, sample, validation, text-mode, command-picker, and pairwise-capable enum stories.
- The old generator-specific schema wrapper layer is gone. Generator-specific schema behavior now lives only in explicit generator-owned support modules such as `generator/schema-support/*` plus generator-configured shared helpers, rather than a parallel generator-owned rendering/event surface underneath the shared component.

### Phase 4: Generator Page Composition

- [x] Replace generator page shell/event binding with `GeneratorPage` component composition.
- [x] Extract `GeneratorControls`.
- [x] Move the current generator row-count host binding into `GeneratorControls` so output format, action buttons, and shared `RowCountControl` instances live behind one feature boundary.
- [x] Extract `GeneratorPreview`.
- [x] Use shared `SharedSchemaDefinition`.
- [x] Use shared `FormatOptionsPanel`.
- [x] Wrap the preview grid with `TabulatorGridAdapter`.
- [x] Add stories for the generator page feature states.
- [x] Move generator preview controls and preview status wiring behind `GeneratorPreview` so the remaining page host only composes schema, controls, and preview feature roots.
- [x] Reduce the generator host shell to feature-root placeholders only, with `GeneratorPage` owning the composition of schema, controls, and preview.

Current status:

- `GeneratorControls` now lives under `generator/controls/` with a controller, view, and create-component factory.
- `GeneratorPage` now lives under `generator/page/` with a controller, view, and create-component factory that composes shared schema definition, generator controls, generator preview, and the schema timed-status surface.
- The generator runtime factory now mounts `GeneratorPage` instead of wiring generator feature roots directly through the old host coordinator path.
- `GeneratorControls` is now mounted through `GeneratorPage`, and that feature owns the generate row-count control, output-format select, generate/pairwise buttons, status surface, and shared `FormatOptionsPanel`.
- `GeneratorPreview` now lives under `generator/preview/` with a controller, view, and create-component factory.
- `GeneratorPreview` is now mounted through `GeneratorPage`, and that feature owns the preview row-count control, preview trigger, output preview textarea, and preview-grid host while preserving the existing DOM IDs used by browser tests.
- The preview grid is now wrapped by `TabulatorGridAdapter`, so Tabulator-specific wiring no longer leaks through the preview feature boundary.
- Storybook now documents both `GeneratorPreview` and `GeneratorPage` directly with small harnesses, so the main generator page features all have reviewable component states outside the live page.
- The old generator host layout/coordinator files are now legacy scaffolding rather than active architecture; leave them in place only until a cleanup pass removes or trims them safely.

### Phase 5: App Data Population Panel

- [x] Extract `DataPopulationPanel` from `app/test-data-grid`.
- [x] Extract `PopulationModeSelector`.
- [x] Extract `PopulationActions`.
- [x] Reuse the shared `RowCountControl`.
- [x] Use shared `SharedSchemaDefinition`.
- [x] Represent new-table, amend-table, and amend-selected modes in Storybook.

Current status:

- `DataPopulationPanel` now lives under `app/data-population-panel/` with a controller, view, and create-component factory.
- `TestDataPopulationToolbar` now lives under `app/test-data-population-toolbar/` with a controller, view, and create-component factory, and owns the visible toolbar seam for generation actions, row count, and mode selection.
- `PopulationModeSelector` and `PopulationActions` now live under their own app feature folders and are mounted through `DataPopulationPanel` rather than through the older test-data host binder path.
- `DataPopulationPanel` now composes `TestDataPopulationToolbar` plus the shared schema definition instead of owning the toolbar sub-layout directly.
- The app test-data controller now mounts `DataPopulationPanel`, reuses the shared `RowCountControl`, and passes app-specific schema behavior through the shared `SharedSchemaDefinition` contract.
- The app test-data generation flow now updates pairwise visibility through the component boundary rather than mutating the pairwise button directly as the primary path.
- Storybook now documents the app-side panel directly through `App / Data Population Panel` with `New Table`, `Amend Table`, and `Amend Selected` mode coverage.
- Storybook now also documents `App / Data Population / Test Data Population Toolbar` directly so the horizontal and wrapped toolbar composition can be reviewed independently from the schema editor.
- Existing app browser flows for new-table, amend-table, amend-selected, schema sync, and pairwise generation remain covered by the current Playwright suite after the migration.

### Phase 6: Import/Export Workspace

- [x] Extract `ImportExportWorkspace`.
- [x] Extract `ImportExportToolbar`.
- [x] Extract `FormatSelector`.
- [x] Reuse `FormatOptionsPanel`.
- [x] Extract `TextPreviewEditor`.
- [x] Finish moving file input, drag/drop, download, and clipboard behavior behind explicit services/adapters instead of the remaining legacy import/export control path.
- [x] Continue shrinking the remaining export-format Storybook harness so the old broad `storybook-harnesses.js` surface is no longer the default path for export preview stories.

Current status:

- `ImportExportWorkspace` now lives under `app/import-export-workspace/` with a controller, view, and create-component factory.
- `ImportExportToolbar`, `FormatSelector`, and `TextPreviewEditor` now live under their own app feature folders and are mounted through `ImportExportWorkspace` rather than through direct page bootstrap wiring.
- The app bootstrap now mounts the import/export area through `createImportExportWorkspaceComponent(...)`, and the `tabbedTextArea` preview region now lives inside that feature boundary instead of as a separate sibling shell.
- The extracted workspace reuses the shared `FormatOptionsPanel`, and the current import/export behavior now runs through the workspace controller/services path instead of the old import/export controls path underneath.
- File input, drag/drop, file reading, download, and clipboard behavior now flow through explicit Phase 6 app-side adapters/services under `app/import-export-adapters/`, so the legacy import/export control layer no longer talks directly to `FileReader`, the drop-zone adapter surface, or download/copy browser APIs.
- Storybook now documents `ImportExportWorkspace`, `ImportExportToolbar`, `FormatSelector`, and `TextPreviewEditor` directly with small component stories instead of relying only on the older broader app/export harnesses.
- The export-format preview stories now mount through `ImportExportWorkspace` via a dedicated `export-preview-story-harness.js` helper rather than the older split `ImportExportControls + TabbedTextControl` story path or the broader omnibus `storybook-harnesses.js` module.
- Existing app browser flows for format switching, extension-label updates, preview/edit mode, and export-format rendering remain covered after the Phase 6 extraction.
- Phase 6 is now functionally complete; remaining Storybook-harness cleanup lives under the broader Phase 8 cleanup bucket if further legacy helper trimming is still worthwhile.

### Phase 7: Data Grid Editor and Tabulator Adapter

- [x] Define `DataGridComponent` with a Tabulator adapter boundary.
- [x] Keep Tabulator-specific APIs inside `TabulatorGridAdapter`.
- [x] Make `TabulatorGridAdapter` and Tabulator-backed child components resilient to disconnected or late-connected roots so they mount naturally in Storybook, tests, and page runtime without story-specific connection timing work.
- [x] Extract grid toolbar/header/row/filter controls where useful.
- [x] Add stories with fake grid service for controls that do not need real Tabulator.
- [x] Add stories with real Tabulator only where rendering behavior is the subject.

Current status:

- `DataGridComponent` now lives under `data-grid-editor/` with a controller, view, and create-component factory, and the active app-side Tabulator grid path now flows through that component boundary.
- The active Tabulator main-display wrapper is now a thin compatibility shell over `createDataGridComponent(...)`, so the app bootstrap keeps its current interface while the real behavior lives in the componentized layer.
- `TabulatorGridAdapter` now lives in shared `data-grid-editor/tabulator-grid-adapter.js` and is reused by both the app-side grid editor and the generator preview grid.
- The shared adapter now waits for both a connected root and the real Tabulator `tableBuilt` lifecycle before exposing itself as ready, which removes the old Storybook/story-host timing hacks from real Tabulator-backed stories.
- `GridToolbar` now exists as an extracted component with its own Storybook coverage and focused tests, so row actions, filtering, clear-sort, reset-table, and unique-column-names toggling can be reviewed without a real Tabulator instance.
- Storybook now includes a fake-service `Data Grid / Grid Toolbar` story and a real-Tabulator `Data Grid / Data Grid Editor` story, while the existing generator preview/page stories now rely on the shared adapter readiness path instead of custom `requestAnimationFrame` mount choreography.
- Existing browser coverage for app grid editing, filtering, sorting, column operations, row operations, and generator preview behavior remained green after the Phase 7 migration.

### Phase 8: Page Bootstraps and Cleanup

- [x] Reduce `packages/core-ui/js/script.js` to app composition/bootstrap.
- [x] Reduce generator controller entrypoint to composition/bootstrap.
- [x] Remove or trim the legacy generator host layout/coordinator helpers now that `GeneratorPage` owns generator feature composition.
- [x] Remove or trim the legacy app test-data host binder/coordinator helpers now that `DataPopulationPanel` owns the app-side composition of actions, mode selection, row count, and schema definition.
- [x] Remove obsolete Storybook harness patches.
- [x] Remove obsolete global DOM lookups.
- [x] Confirm all component stories are discoverable and documented.
- [x] Run the full local verification gate.
- [x] Replace duplicated static app/generator instructions markup with a shared `Instructions` component reused by both pages.
- [x] Replace duplicated app/generator page shell markup in HTML and Storybook with shared page-shell components.

Current status:

- `packages/core-ui/js/script.js` now only owns DOM-ready bootstrap wiring and delegates the app-page setup to `app/page/app-page-runtime.js`, which in turn owns the remaining startup orchestration and instruction-sample grid actions.
- The generator public entrypoint now exports directly from `generator/runtime/create-generator-page.js`, so the old empty controller wrapper has been removed.
- The legacy generator host layout/coordinator files under `gui_components/generator/host/` are removed; `GeneratorPageView` now owns the generator page shell and feature composition directly.
- The legacy app test-data host binder/coordinator files under `gui_components/app/test-data-grid/host/` are removed; `DataPopulationPanel` and `SharedSchemaDefinition` now own that behavior directly.
- The old Storybook `storybook-harnesses.js` file and the legacy `Test Data / Generator` story set are removed, along with the document monkey-patching they depended on.
- The old host-layer tests that only exercised deleted scaffolding are removed, while the current page/component coverage remains under the newer generator/app component stories and tests.
- Story discoverability/documentation is now centered on the component-oriented Storybook families (`Generator Page`, `Generator Controls`, `Generator Preview`, `App Data Population Panel`, `Import Export Workspace`, `Data Grid Editor`, shared components, and format-option families) rather than the older broad legacy harness stories.
- The app page and generator page instructions now render through one shared `Instructions` component, preserving the app’s copy-to-grid action and the generator’s overview help while removing duplicated static page markup.
- The app page and generator page now share reusable `core-ui` page-shell components for functional roots and layout, while host-specific HTML chrome such as site headers and startup loading placeholders lives in `apps/web/*.html`.

## Post-Migration Hardening Plan

The phased migration is complete. The next work is cleanup, simplification, and hardening on top of the component model now in place.

Use this section as the follow-on backlog rather than adding a Phase 9. The goals are to remove compatibility layers that only exist for old entry APIs, tighten Storybook reliability, document the final architecture, and retire dead helper exports left behind by the migration.

### Hardening 1: Compatibility Wrapper Cleanup

- [x] Audit compatibility wrappers that still preserve old entry APIs, starting with the app main-grid bootstrap path and `packages/core-ui/js/gui_components/generator/controller/data-generator-page-controller.js`.
- [x] Identify which wrapper exports are still consumed by app runtime, tests, Storybook, or package public exports.
- [x] Remove wrappers that have no external consumers, or turn them into intentionally documented public facades when they still provide useful compatibility.
- [x] Update imports to point at the component-oriented APIs where the compatibility layer is no longer needed.
- [x] Add or update focused regression coverage before removing a wrapper that still sits on a user-facing path.

Current status:

- The empty generator controller wrapper and the extra top-level generator feature pass-through barrel are both gone. Standalone bootstrap, focused harnesses, and generator runtime coverage now import `createDataGeneratorPage(...)` directly from `generator/runtime/create-generator-page.js`, while low-level unmounted runtime coverage uses a dedicated runtime-module helper instead of treating a `DataGeneratorPage` class as part of the public feature surface.
- The unused `DataGeneratorPageRuntime` alias was removed after confirming there were no internal consumers.
- The remaining app-side main-grid compatibility facade has been removed. The app runtime and app page Storybook story now both mount `createDataGridComponent(...)` directly while injecting the supported Tabulator services explicitly.
- The hidden AG Grid runtime selector path has been removed, along with its AG Grid runtime/test files, after confirming there was no real product-facing AG Grid entry point beyond the old compatibility override path.
- Focused regression coverage remains in the app bootstrap tests, `DataGridComponent` tests, and the simplified grid-library-loader tests to prove the direct runtime bootstrap contract.

### Hardening 2: Storybook Interaction Tightening

- [x] Audit newer component stories for brittle text queries, duplicate IDs, ambiguous help-icon selectors, and story-only setup that no longer reflects real component behavior.
- [x] Tighten generator preview and generator page stories first, because they include real child components, help tippies, and Tabulator-backed preview behavior.
- [x] Prefer role-based and accessible-name queries in Storybook `play` interactions when the UI exposes suitable semantics.
- [x] Make interactions assert the meaningful state each story is meant to teach, not only that a component mounted.
- [x] Keep Storybook examples aligned with the visible-child rule: when a child component is visible, it should use real behavior unless the story visibly replaces it with a placeholder.

Current status:

- Generator preview and generator page stories assert visible controls by role/name, assert output textarea values, and verify Tabulator-backed preview-grid content through the preview grid region.
- Generator page help assertions now use the schema help behavior hook instead of an ID suffix selector.
- The generator page stories continue to compose the real schema, controls, preview, and Tabulator preview adapter paths rather than replacing visible children with inert mocks.

### Hardening 3: Final Architecture Documentation

- [x] Add a short architecture document that explains the final frontend component model after the migration.
- [x] Cover page runtime/bootstrap responsibilities versus page shell/view responsibilities.
- [x] Document the layers: page components, feature components, shared components, primitives, presenters/services, and adapters.
- [x] Explain the test layering: unit tests, DOM/component tests, Storybook review and lightweight interactions, and Playwright page workflows.
- [x] Link the architecture document from this migration plan and from any relevant contributor docs if useful.

Current status:

- See `docs/frontend-component-architecture.md` for the current page runtime, page shell, component layer, selector, Storybook, test-layering, and compatibility policy.
- `AGENTS.md` now points agents to the architecture document before frontend component work.

### Hardening 4: Dead-Code and Export Cleanup

- [x] Run a dead-code audit for older helper APIs that are still exported but no longer used after the new component boundaries replaced them.
- [x] Remove unused helpers, tests, and Storybook-only shims that no longer serve current stories or runtime code.
- [x] Review public exports from `packages/core-ui/src/index.js` and nearby barrel files for APIs that only exist because of the pre-migration structure.
- [x] Keep compatibility aliases only when there is a clear external or documented reason.
- [x] Update tests and docs when removing an exported API so the remaining public surface is intentional.

Current status:

- `packages/core-ui/src/index.js` remains intentionally narrow: it exports only `bootstrapApp` and `bootstrapGeneratorPage`.
- The old timed-error compatibility exports were removed from `shared/timed-error-display.js`; consumers now use `createTimedStatusPresenter` and `TimedStatusDisplay`.
- The old `enableTestDataGenerationInterface` alias has been removed; the app test-data entry surface now exposes only `mountTestDataGenerationPanel`.
- The old `createTestDataGridControl` helper export has also been removed; Storybook and interaction harnesses now use `createTestDataGenerationPanelManager(...)` for the remaining non-runtime panel host path.

### Hardening 5: Public API Naming Pass

- [x] Audit legacy public names that describe old behavior or old ownership boundaries, such as `enableTestDataGenerationInterface`.
- [x] Propose clearer component/page-oriented names for APIs that should remain public.
- [x] Add compatibility aliases only where needed for downstream consumers, and mark them as legacy in code comments or docs.
- [x] Update internal imports to use the newer names first, then remove legacy names once there are no remaining internal consumers.

Current status:

- `mountTestDataGenerationPanel` is the component-oriented app test-data panel mount API.
- Internal app runtime uses `mountTestDataGenerationPanel`, while Storybook, focused app harnesses, and the remaining controller contract tests now use `createTestDataGenerationPanelManager(...)` for the non-runtime mounting helper path.
- The old `enableTestDataGenerationInterface` alias has been removed from the app test-data-grid barrel/controller after confirming there were no live runtime consumers left in the repo.

### Hardening 6: Component Selectors and IDs

- [x] Audit reusable components for fixed internal IDs that could collide when multiple instances render in Storybook Docs or page composition.
- [x] Keep IDs for page-level mount roots and intentional legacy DOM contracts only.
- [x] Prefer root-scoped `data-*` behavior hooks for component internals.
- [x] Prefer classes for styling hooks.
- [x] Prefer role/name queries in Storybook interactions, DOM tests, and Playwright tests.
- [x] Amend Playwright page objects where necessary so they use user-facing roles/names or intentional page-level contracts rather than reusable-component internals.
- [x] Amend component tests where necessary so they query through rendered behavior, accessible names, or root-scoped `data-*` hooks instead of fixed internal IDs.
- [x] Replace brittle ID-based story/test queries where the ID is not part of a public page contract.

Current status:

- `AGENTS.md` now has explicit frontend selector-contract guidance for reusable components, Storybook, component tests, Playwright tests, and Playwright page objects.
- Generator Playwright component abstractions use role/name and label queries for generator controls and preview controls; Tabulator cell/header selectors remain encapsulated inside the preview page object because the third-party grid does not expose a stable accessible table API for those assertions.
- Component tests still use root-scoped `data-*`, input names, and intentional page-level IDs where those are the public DOM contracts under test.

### Hardening Exit Criteria

- [x] Remaining compatibility wrappers are either removed or intentionally documented as public facades.
- [x] Component stories use stable, accessible interactions and avoid story-only behavior for visible child components.
- [x] The final frontend architecture is documented outside the migration checklist.
- [x] Dead helper exports left behind by the migration have been removed or explicitly justified.
- [x] Public API names reflect the current component/page model.
- [x] Reusable components avoid fixed internal IDs except where there is an intentional page-level or legacy contract.
- [x] `pnpm run verify:local` passes after each completed hardening item or coherent item group.

## Storybook-Driven Visible Component Backlog

Use this backlog when the next migration step should be chosen from the reviewer-facing Storybook surface rather than from internal helper seams alone.

- [x] Add dedicated Storybook coverage for the method-picker dialog in `shared/test-data/ui/method-picker-modal.js`, including:
  - confirmed selection flow
  - cancel flow
  - filtered or tab-scoped selection flow
- [x] Add dedicated Storybook coverage for `PopulationModeSelector` instead of only showing it inside `DataPopulationPanel`.
- [x] Add dedicated Storybook coverage for `PopulationActions` instead of only showing it inside `DataPopulationPanel`.
- [x] Split the app import/export drop-zone surface into a reviewer-facing visual component or explicit Storybook-visible boundary instead of leaving drag/drop behavior visible only through the full workspace story.
- [x] Add reviewer-facing `Visual Always Open` or `Visual Always Visible` Storybook examples for dialog and presenter surfaces that previously only demonstrated trigger-first flows.
- [x] Add standalone Storybook coverage for the app page shell structure so reviewers can inspect shell composition separately from full app bootstrap.
- [x] Add standalone Storybook coverage for the generator page shell structure so reviewers can inspect shell composition separately from full generator bootstrap.
- [x] Re-audit Storybook after each new visible split and add follow-up unchecked items when a feature still renders meaningful visible child UI only through a broader page story.
- [x] Split the schema section wrapper into one shared `SchemaPanel` component and add standalone Storybook coverage for the app and generator host configurations.
- [x] Re-audit app and generator page stories again after the shared schema-panel extraction to identify the next visible feature wrapper that still only appears through a broader page story.
- [x] Extract the import/export options-preview split layout from `ImportExportWorkspaceView` into a focused component or view helper with Storybook coverage for supported format, unsupported format, keyboard resize, and narrow-width clamping states.
- [x] Split the generator output-format dropdown from `GeneratorControlsView` into a focused `GeneratorOutputFormatSelector` component with Storybook coverage for core formats, code formats, unit-test formats, and unsupported-format filtering.
- [ ] Expand `GeneratorControls` Storybook coverage with busy/loading/status states so reviewers can inspect the composed row count, format selector, actions, options panel, and status integration without using the full generator page story.
- [x] Add a small re-audit note for `TextPreviewEditor` after the options-preview split extraction to decide whether its Preview/Edit controls need a separate toolbar component or whether the current focused story is enough.
- [x] Add reviewer-facing file export encoding settings coverage for app download controls and generator controls so OS-default line endings and explicit CR/LF+BOM transport settings are documented outside full page stories.

Current status:

- The command picker dialog now has dedicated reviewer-facing Storybook coverage in `apps/web/src/stories/method-picker-dialog.stories.js`, with confirmed, cancelled, and filtered-selection flows.
- The command picker dialog stories now also include a non-dismissing visual review example that renders the picker open immediately and logs `Apply`, `Cancel`, close-button, and backdrop actions without closing the overlay, so reviewers can inspect the component visually while the other stories keep covering the real promise-driven service flow.
- The shared confirm dialog and text-input dialog stories now follow that same review pattern with `Visual Always Open` examples, and the loading/status presenter stories now expose `Visual Always Visible` examples so the rendered presenter state can be reviewed immediately instead of only after pressing a trigger button.
- `PopulationModeSelector` now has dedicated reviewer-facing Storybook coverage in `apps/web/src/stories/population-mode-selector.stories.js`, with default, emitted-change, and alternate-initial-mode states.
- `PopulationActions` now has dedicated reviewer-facing Storybook coverage in `apps/web/src/stories/population-actions.stories.js`, and the action cluster is now reused by generator controls as a shared icon+tippy action component with host-specific HTML help content for app-to-grid versus generator-to-file flows.
- The embedded app test-data panel no longer exposes a separate `Refresh Text Preview` button; successful generate/amend flows now refresh the preview automatically so the shared action cluster stays aligned with the generator surface.
- The import/export toolbar Storybook docs now expose the real file-input and drag/drop surface directly, with dedicated reviewer-facing stories for the default toolbar, file-import boundary, and busy/status state instead of leaving drag/drop behavior implicit inside the full workspace story.
- The import/export toolbar Storybook docs now also cover the import-only trim settings disclosure, so reviewers can inspect the new import trim radios and field-list textbox without booting the full app page.
- App and generator page shell composition now also have standalone reviewer-facing Storybook coverage in `app-page-shell.stories.js` and `generator-page-shell.stories.js`, using explicit placeholder mount-root cards so reviewers can inspect shell layout separately from full bootstrap/runtime behavior.
- The re-audit found that both app and generator still owned visible schema wrapper markup around the shared schema definition. That wrapper is now one shared `SchemaPanel` component with standalone Storybook host coverage in `generator-schema-panel.stories.js` and `test-data-schema-panel.stories.js`, so `DataPopulationPanel` and `GeneratorPage` both compose a shared schema wrapper instead of carrying host-local copies.
- The post-`SchemaPanel` re-audit found no urgent missing primary stories for schema, page shells, instructions, app data population, generator controls, generator preview, data grid editor, import/export toolbar, text preview editor, format selector, or format options. The next useful Storybook-driven splits are smaller visible sub-surfaces: the import/export options-preview split layout and the generator output-format selector.
- The import/export options-preview shell is now a focused app-side component with its own Storybook docs and direct tests. `ImportExportWorkspaceView` no longer owns the splitter drag/keyboard/clamping behavior itself; it now composes the dedicated split-layout boundary through `TextPreviewEditor`.
- `GeneratorControls` now composes a dedicated `GeneratorOutputFormatSelector` component, and Storybook documents that selector directly through `generator-output-format-selector.stories.js` instead of only through the larger controls surface.
- `DataGridComponent` now composes a dedicated `GridRowVisibilitySummary` MVC control, and Storybook documents that status surface directly through `grid-row-visibility-summary.stories.js` instead of only through the full data-grid story.
- The `TextPreviewEditor` re-audit showed that its Preview/Edit controls were still a meaningful visible sub-surface. That cluster is now a dedicated `TextPreviewToolbar` component with its own Storybook docs and focused tests, while `TextPreviewEditor` keeps the textarea and split-layout shell composition.
- `ImportExportWorkspace` now shows a dedicated grid/preview sync row above a closed-by-default native `Import / Export` details section, leaving Auto Sync, Preview/Edit, row count, format tabs, and text preview outside the collapsible import/export toolbar area.
- App download controls and generator controls now also expose reviewer-facing file export encoding settings through a small settings disclosure, with Storybook examples covering default OS-derived line endings and explicit Windows CR/LF plus BOM output.

## Generator Runtime Simplification Follow-On

The generator runtime has become more indirect than the MVC-style component architecture we want to end up with. Use [docs/generator-runtime-simplification-map.md](D:/github/grid-table-editor/docs/generator-runtime-simplification-map.md) as the concrete collapse plan for the next generator-side cleanup pass.

Current status:

- The runtime boot stack and page-config assembly chain have now been collapsed into direct runtime and runtime-config builders.
- The earlier bridge/dependencies naming in the surviving action/view-state/schema helper cluster has now been reduced to responsibility-based service/runtime names, including the generator schema-generation service.

## MVC Cleanliness Follow-On

Use `docs/frontend-mvc-cleanliness-checklist.md` as the repo-specific audit guide for deciding whether an existing component is really clean MVC or only partially componentized.

- [x] Extract an explicit import/export workspace runtime or workflow service so `createImportExportWorkspaceComponent(...)` becomes thin wiring instead of owning the current async import/export orchestration directly.
- [x] Continue the generator runtime simplification pass by collapsing the remaining schema support/session/runtime helper cluster after the action/view-state/service naming cleanup.
- [x] Split the generator output-format selector from `GeneratorControls` into a focused reviewer-facing component with its own Storybook coverage.
- [x] Re-audit `TextPreviewEditor` after the output-format-selector split to decide whether its Preview/Edit controls should become a dedicated toolbar component.
- [x] Re-audit `ImportExportWorkspace` after the generator-page simplification pass and split the remaining workflow service if it still spans multiple already-visible child surfaces.
- [x] Split the visible import/export toolbar into reviewer-facing `Grid Preview Sync`, `Import`, and `Download` MVC components so drag/drop no longer sits implicitly after Download in one broad surface.
- [ ] Expand `GeneratorControls` Storybook coverage with busy/loading/status states so reviewers can inspect the composed status surface directly.

Current status:

- `ImportExportWorkspace` now routes its async import/export orchestration through `create-import-export-workspace-runtime.js`, so the public component entrypoint is mostly a thin wrapper around document/window resolution and runtime delegation instead of owning the feature workflow directly.
- `ImportExportWorkspace` runtime now delegates the actual import/export/preview behavior into `create-import-export-workspace-workflow-service.js`, leaving the runtime responsible mainly for dependency setup, child-component composition, and lifecycle wiring.
- The generator page runtime now uses a flatter page-service shape for the live action, view-state, and schema cluster: `generator-page-service.js`, `generator-page-actions-service.js`, `generator-page-view-state.js`, `create-generator-page-runtime-config.js`, and `create-generator-page-schema-services.js`.
- `GeneratorControls` now composes a dedicated `GeneratorOutputFormatSelector` component, and Storybook documents that selector directly through `generator-output-format-selector.stories.js` instead of only through the larger controls surface.
- `TextPreviewEditor` now composes a dedicated `TextPreviewToolbar` component for its Preview/Edit controls, leaving the parent editor responsible for textarea and options/preview split-layout composition instead of the whole visible top toolbar surface.
- The generator schema runtime is now assembled through one direct responsibility-based builder instead of separate support/session/services wrappers, and the mounted-page state maps page collaborators directly instead of going through a mounted-page bridge.
- The schema-to-generator helper is now named and used as `createGeneratorSchemaGenerationService(...)` / `generatorSchemaGenerationService`, so the last live generator-side `bridge` label in that path has been removed.
- The fresh post-simplification MVC re-audit found no new urgent generator-page runtime sprawl.
- `ImportExportWorkspace` now also has a cleaner service map: the old broad workspace workflow has been split into `create-import-export-preview-workflow-service.js` and `create-import-export-file-transfer-service.js`, while `create-import-export-workspace-workflow-service.js` now mainly composes those narrower services for the runtime.
- `ImportExportToolbar` is now also split along its visible review boundaries: `ImportExportGridPreviewSyncControl`, `ImportExportImportControl`, and `ImportExportDownloadControl` each have their own MVC component and Storybook coverage. The workspace now renders the sync control as its own visible row, while the toolbar host keeps only import/download help-error framing plus composed layout inside the disclosure.
- Shared schema storage is now tracked as a reusable MVC surface as well: `SchemaPanel` can compose a shared `StoredSchemasManager` below the shared schema editor so app and generator hosts can share draft recovery, last-used history, and named saved-schema management without pushing storage logic back into page runtimes.

## Tracking Across Sessions

Use this file as the durable migration tracker.

At the start of a related development session:

- Read `AGENTS.md`.
- Read this file.
- Check current git status.
- Pick one unchecked item or a small coherent group of items.
- Keep the change small enough to verify confidently.

During a session:

- Update checkboxes only for work actually completed.
- Add newly discovered follow-up work under the relevant phase.
- Add newly discovered follow-up work as explicit unchecked todo items, not only as prose in status notes.
- Add notes when a component boundary turns out to be wrong or too broad.

At the end of a session:

- Update this file if the migration state changed. This is part of the definition of done for migration work.
- Report which phase/item moved.
- Add any newly discovered next-step work as concrete unchecked todo items in the relevant phase.
- Report verification results.
- If code changed, run `pnpm run verify:local` before calling the task complete.
- If UI code, UI test abstractions, or browser tests changed, also run `pnpm run test:browser`, `pnpm run test:storybook`, `pnpm run build-storybook`, and the relevant Jest suites.

## Component Readiness Checklist

Before considering a component migrated:

- [ ] It has a controller, view, and create-component factory, or a documented reason why it is view-only/service-only.
- [ ] It has at least one Storybook story.
- [ ] It has Storybook docs that explain the component and its important states or modes.
- [ ] Storybook setup is small and explicit.
- [ ] It can be destroyed cleanly.
- [ ] It does not query outside its root.
- [ ] It receives services and callbacks explicitly.
- [ ] It has focused Jest coverage for controller behavior.
- [ ] It has DOM interaction coverage when behavior depends on rendered UI.
- [ ] Existing app or generator behavior remains covered by current browser tests.
- [ ] If it wraps a third-party widget such as Tabulator, it mounts correctly without story-specific connection timing hacks.
