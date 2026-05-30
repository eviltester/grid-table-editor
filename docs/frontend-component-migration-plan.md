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

      HelpAndShell
        ThemeToggle
        HelpTooltipHost
        ConfirmDialogHost
        TextInputDialogHost

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
        OutputPreviewText
        PreviewDataGrid
          TabulatorGridAdapter

shared
  schema-definition
    SharedSchemaDefinition
    SchemaModeToggle
    SchemaRowsEditor
    SchemaRow
    SchemaTextEditor
    SchemaValidationStatus
    SchemaCommandPicker

  format-options
    FormatOptionsPanel
    CsvOptionsPanel
    JsonOptionsPanel
    SqlOptionsPanel
    HtmlOptionsPanel
    CodeOptionsPanel
    UnitTestOptionsPanel

  data-grid
    DataGridComponent
    TabulatorGridAdapter

  dialogs
    ConfirmDialog
    TextInputDialog
    MethodPickerDialog

  status
    StatusPresenter
    TimedErrorDisplay
```

## Current Code Anchors

The existing code already has useful partial boundaries:

- App bootstrap: `packages/core-ui/js/script.js`
- Generator page entrypoint: `packages/core-ui/js/gui_components/generator/controller/data-generator-page-controller.js`
- Generator shell and event binding: `packages/core-ui/js/gui_components/generator/host/`
- Generator schema rendering: `packages/core-ui/js/gui_components/generator/schema/`
- Generator generation actions: `packages/core-ui/js/gui_components/generator/generation/`
- App test-data panel host: `packages/core-ui/js/gui_components/app/test-data-grid/host/`
- App test-data controller: `packages/core-ui/js/gui_components/app/test-data-grid/controller/`
- Shared schema logic: `packages/core-ui/js/gui_components/shared/test-data/schema/`
- Import/export controls: `packages/core-ui/js/gui_components/app/import-export-controls.js`
- Tabbed text control: `packages/core-ui/js/gui_components/app/tabbed-text-control.js`
- Tabulator grid wrappers: `packages/core-ui/js/gui_components/data-grid-editor/tabulator/`
- Existing Storybook harnesses: `apps/web/src/stories/storybook-harnesses.js`

## Migration Phases

### Phase 0: Establish Standards

- [ ] Agree on the component contract in this document.
- [ ] Create a small example component using `Controller + View + createComponent`.
- [ ] Add a Storybook story for the example component.
- [ ] Add Jest tests for the example controller and view.
- [ ] Document the naming and folder conventions in this file after the example lands.

Recommended first example: a simple status or row-count control, because the blast radius is low.

### Phase 1: Small Shared Building Blocks

- [ ] Convert `StatusPresenter` into a component-shaped API or adapter-compatible service.
- [ ] Convert `TimedErrorDisplay` usage into an injectable status/error service where practical.
- [ ] Wrap confirm and text-input modal usage behind services.
- [ ] Create Storybook stories for status, timed error, confirm dialog, and text input dialog.
- [ ] Ensure each story can mount without page bootstrap.

Definition of done:

- Storybook stories are small.
- Unit tests cover controller behavior where applicable.
- No production behavior changes except explicitly intended lifecycle cleanup.

### Phase 2: Format Options Components

- [ ] Create a shared `FormatOptionsPanel` feature with controller/view/component factory.
- [ ] Move option-panel selection and dirty/apply state out of page-level controllers.
- [ ] Wrap existing individual option panels so they can be mounted in Storybook independently.
- [ ] Add stories for CSV, delimited, JSON, JSONL, SQL, XML, HTML, Markdown, ASCII, code, and unit-test code options.
- [ ] Keep exporter/importer option sanitization in service functions, not view code.

Definition of done:

- Generator and app import/export can use the same format-options component.
- Option panels do not require global `document.querySelector`.
- Stories can show default, dirty, applied, and format-switched states.

### Phase 3: Shared Schema Definition

- [ ] Create `SharedSchemaDefinitionController`.
- [ ] Create `SharedSchemaDefinitionView`.
- [ ] Create `createSharedSchemaDefinitionComponent`.
- [ ] Use existing shared schema logic from `shared/test-data/schema/` rather than duplicating it.
- [ ] Componentize `SchemaModeToggle`.
- [ ] Componentize `SchemaRowsEditor`.
- [ ] Componentize `SchemaRow`.
- [ ] Componentize `SchemaTextEditor`.
- [ ] Componentize `SchemaValidationStatus`.
- [ ] Keep `SchemaCommandPicker` as a dialog service or child component with explicit inputs.
- [ ] Add stories for empty schema, sample schema, validation errors, text mode, grid mode, command picker, and pairwise-capable enum schema.

Definition of done:

- Generator page and app data-population panel both depend on shared schema-definition behavior.
- Storybook does not need separate large harnesses for app schema and generator schema.
- The schema component emits schema changes and validation state through callbacks/events.

### Phase 4: Generator Page Composition

- [ ] Replace generator page shell/event binding with `GeneratorPage` component composition.
- [ ] Extract `GeneratorControls`.
- [ ] Extract `GeneratorPreview`.
- [ ] Use shared `SharedSchemaDefinition`.
- [ ] Use shared `FormatOptionsPanel`.
- [ ] Wrap the preview grid with `TabulatorGridAdapter`.
- [ ] Add stories for the generator page feature states.
- [ ] Keep browser tests user-like and black-box.

Definition of done:

- `DataGeneratorPage` is mostly composition and services.
- Feature-level stories can run without the full page.
- Existing generator Playwright tests still pass.

### Phase 5: App Data Population Panel

- [ ] Extract `DataPopulationPanel` from `app/test-data-grid`.
- [ ] Extract `PopulationModeSelector`.
- [ ] Extract `PopulationActions`.
- [ ] Extract `RowCountControl` or reuse the generator row-count component.
- [ ] Use shared `SharedSchemaDefinition`.
- [ ] Represent new-table, amend-table, and amend-selected modes in Storybook.
- [ ] Add stories for preview refresh, generation status, validation error, and pairwise generation.

Definition of done:

- The embedded app data-population panel has small Storybook stories.
- The panel emits populate/amend requests instead of directly reaching into grid internals.
- Existing app test-data browser tests still pass.

### Phase 6: Import/Export Workspace

- [ ] Extract `ImportExportWorkspace`.
- [ ] Extract `ImportExportToolbar`.
- [ ] Extract `FormatSelector`.
- [ ] Reuse `FormatOptionsPanel`.
- [ ] Extract `TextPreviewEditor`.
- [ ] Wrap file input, drag/drop, download, and clipboard as services/adapters.
- [ ] Add stories for start-blank, auto-previewed, edit mode, invalid import, busy import, download, and copy states.
- [ ] Replace large export Storybook harnesses with smaller component stories over time.

Definition of done:

- Import/export stories no longer need scoped global document patching.
- Components emit import/export requests and receive results through explicit services.
- Existing import/export browser tests still pass.

### Phase 7: Data Grid Editor and Tabulator Adapter

- [ ] Define `DataGridComponent` with a Tabulator adapter boundary.
- [ ] Keep Tabulator-specific APIs inside `TabulatorGridAdapter`.
- [ ] Extract grid toolbar/header/row/filter controls where useful.
- [ ] Add stories with fake grid service for controls that do not need real Tabulator.
- [ ] Add stories with real Tabulator only where rendering behavior is the subject.
- [ ] Ensure destroy paths clean up Tabulator instances.

Definition of done:

- Most app components do not know Tabulator exists.
- Grid tests interact through rendered UI, not direct Tabulator internals.
- Existing grid browser tests still pass.

### Phase 8: Page Bootstraps and Cleanup

- [ ] Reduce `packages/core-ui/js/script.js` to app composition/bootstrap.
- [ ] Reduce generator controller entrypoint to composition/bootstrap.
- [ ] Remove obsolete Storybook harness patches.
- [ ] Remove obsolete global DOM lookups.
- [ ] Confirm all component stories are discoverable and documented.
- [ ] Run the full local verification gate.

Definition of done:

- `pnpm run verify:local` passes.
- `pnpm run test:browser` passes when UI/browser abstractions changed.
- Storybook build passes.
- The app and generator can be understood as page composition plus shared feature components.

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
- Add notes when a component boundary turns out to be wrong or too broad.
- Keep user-facing docs separate from this internal plan.

At the end of a session:

- Update this file if the migration state changed.
- Report which phase/item moved.
- Report verification results.
- If code changed, run `pnpm run verify:local` before calling the task complete.
- If UI code, UI test abstractions, or browser tests changed, also run `pnpm run test:browser` and the relevant Jest suites.

Optional GitHub tracking:

- Use GitHub issues for phase-level work when coordination is needed across branches or contributors.
- Keep this document as the source of architectural intent.
- Link issues back to this document rather than duplicating the full plan in every issue.

## Component Readiness Checklist

Before considering a component migrated:

- [ ] It has a controller, view, and create-component factory, or a documented reason why it is view-only/service-only.
- [ ] It has at least one Storybook story.
- [ ] Storybook setup is small and explicit.
- [ ] It can be destroyed cleanly.
- [ ] It does not query outside its root.
- [ ] It receives services and callbacks explicitly.
- [ ] It has focused Jest coverage for controller behavior.
- [ ] It has DOM interaction coverage when behavior depends on rendered UI.
- [ ] Existing app or generator behavior remains covered by current browser tests.

## Open Decisions

- Should component outputs standardize on callbacks, `CustomEvent`, or both?
- Should shared feature components live under `packages/core-ui/js/gui_components/shared/` or a new `components/` namespace?
- Should Storybook stories live next to implementation files long term, or remain centralized under `apps/web/src/stories/`?
- Should existing option panel classes be wrapped first or rewritten into controller/view pairs immediately?
- Should page-level browser test abstractions mirror the new component hierarchy as migration progresses?
