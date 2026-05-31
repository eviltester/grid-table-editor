# Frontend Component Migration Plan

This is an internal engineering plan for moving the current plain JavaScript UI toward small, independently testable components while keeping the app framework-light. The target style is:

- `ThingController` for state, orchestration, validation, service calls, and emitted actions.
- `ThingView` for DOM rendering and user interaction inside one supplied root element.
- `createThingComponent` for wiring the controller and view into a small lifecycle API.
- Storybook stories for every component, with small harnesses as a quality signal.

This plan intentionally does not require React, Vue, Svelte, or Lit. The structure should make a future Lit migration possible by replacing `ThingView` with a Lit element while keeping controllers, services, and adapters stable.

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
- Generator page entrypoint: `packages/core-ui/js/gui_components/generator/controller/data-generator-page-controller.js`
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
- The generator `generateRowsCount` and `previewRowsCount` fields now use the shared `RowCountControl`.
- The generator keeps its existing validation-first behavior by reusing the shared component without changing the row-count input IDs or page-level parsing contract.

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
- [ ] Remove the now-redundant generator-specific schema rendering/event helpers after the generator runtime adopts the shared component.

Current status:

- `SharedSchemaDefinition` now lives under `shared/schema-definition/` with a controller, view, and create-component factory.
- The new component reuses the existing shared schema parsing, validation, row-editing, command-picker, drag/drop, and text-mode logic from `shared/test-data/schema/` instead of duplicating those rules.
- The app test-data panel now mounts its schema editor through `SharedSchemaDefinition`, keeping the same DOM IDs so the rest of the app flow and browser tests continue to treat the schema surface as a black box.
- The generator page now also mounts its live schema editor through `SharedSchemaDefinition`, while preserving the existing DOM IDs, row-level browser interactions, and text-mode generate/pairwise flows.
- Generator runtime adoption also moved the shared text-mode syncing, method-picker command selection, semantic-validation caret preservation, and pairwise-button visibility behavior onto the shared component path.
- Storybook now documents the shared component directly with empty, sample, validation, text-mode, command-picker, and pairwise-capable enum stories.
- The next explicit Phase 3 step is deleting or renaming the remaining generator-specific schema rendering helpers that still sit underneath the shared component so the shared layer no longer looks generator-owned.

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
- `DataGeneratorPage` now mounts `GeneratorPage` instead of wiring generator feature roots directly through the old host coordinator path.
- `GeneratorControls` is now mounted through `GeneratorPage`, and that feature owns the generate row-count control, output-format select, generate/pairwise buttons, status surface, and shared `FormatOptionsPanel`.
- `GeneratorPreview` now lives under `generator/preview/` with a controller, view, and create-component factory.
- `GeneratorPreview` is now mounted through `GeneratorPage`, and that feature owns the preview row-count control, preview trigger, output preview textarea, and preview-grid host while preserving the existing DOM IDs used by browser tests.
- The preview grid is now wrapped by `TabulatorGridAdapter`, so Tabulator-specific wiring no longer leaks through the preview feature boundary.
- Storybook now documents both `GeneratorPreview` and `GeneratorPage` directly with small harnesses, so the main generator page features all have reviewable component states outside the live page.
- The old generator host layout/coordinator files are now legacy scaffolding rather than active architecture; leave them in place only until a cleanup pass removes or trims them safely.

### Phase 5: App Data Population Panel

- [ ] Extract `DataPopulationPanel` from `app/test-data-grid`.
- [ ] Extract `PopulationModeSelector`.
- [ ] Extract `PopulationActions`.
- [ ] Reuse the shared `RowCountControl`.
- [ ] Use shared `SharedSchemaDefinition`.
- [ ] Represent new-table, amend-table, and amend-selected modes in Storybook.

### Phase 6: Import/Export Workspace

- [ ] Extract `ImportExportWorkspace`.
- [ ] Extract `ImportExportToolbar`.
- [ ] Extract `FormatSelector`.
- [ ] Reuse `FormatOptionsPanel`.
- [ ] Extract `TextPreviewEditor`.
- [ ] Wrap file input, drag/drop, download, and clipboard as services/adapters.
- [ ] Replace large export Storybook harnesses with smaller component stories over time.

### Phase 7: Data Grid Editor and Tabulator Adapter

- [ ] Define `DataGridComponent` with a Tabulator adapter boundary.
- [ ] Keep Tabulator-specific APIs inside `TabulatorGridAdapter`.
- [ ] Extract grid toolbar/header/row/filter controls where useful.
- [ ] Add stories with fake grid service for controls that do not need real Tabulator.
- [ ] Add stories with real Tabulator only where rendering behavior is the subject.

### Phase 8: Page Bootstraps and Cleanup

- [ ] Reduce `packages/core-ui/js/script.js` to app composition/bootstrap.
- [ ] Reduce generator controller entrypoint to composition/bootstrap.
- [ ] Remove or trim the legacy generator host layout/coordinator helpers now that `GeneratorPage` owns generator feature composition.
- [ ] Remove obsolete Storybook harness patches.
- [ ] Remove obsolete global DOM lookups.
- [ ] Confirm all component stories are discoverable and documented.
- [ ] Run the full local verification gate.

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
