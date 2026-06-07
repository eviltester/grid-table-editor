# Frontend MVC Cleanliness Checklist

Use this checklist when reviewing whether an existing `core-ui` component is actually "clean MVC" rather than only partially componentized.

Read this with:

- `AGENTS.md`
- `docs/frontend-component-architecture.md`
- `docs/frontend-component-migration-plan.md`
- `docs/generator-runtime-simplification-map.md` when the review reaches generator runtime assembly

## Goal

In this repo, clean MVC means a reviewer can understand a feature mostly from:

- one controller
- one view
- one `create...Component(...)` factory
- a small number of clearly named services or adapters

It should not require opening a stack of wrappers, bridges, facades, or config mappers just to find where visible behavior really lives.

## Checklist

Use these checks for existing components.

### 1. Boundary Clarity

- The visible feature has one obvious component entrypoint such as `createThingComponent(...)`.
- The component boundary matches a reviewer-facing UI surface, not an arbitrary helper split.
- Page hosts compose the feature; the feature does not reach back into sibling areas.

### 2. Controller Ownership

- The controller owns user-intent logic, state transitions, parsing, normalization, and validation.
- The controller decides when callbacks fire and what payload they emit.
- The controller can be tested without a DOM.
- The component factory is thin enough that it is not secretly acting as a second controller.

### 3. View Ownership

- The view renders from controller state or explicit props.
- The view binds DOM events only inside one supplied root.
- The view does not perform business decisions that belong in the controller.
- The view does not reach into global DOM except for explicitly injected document-level services.

### 4. Factory Thinness

- `create...Component(...)` mostly wires controller, view, services, and child components together.
- The factory does not own long workflow closures, async orchestration, or broad mutable state when that work could live in a controller or runtime/service.
- Public methods returned from the factory are small and intentional.

### 5. Service and Adapter Honesty

- Browser, third-party, and document-level concerns stay in injected services or adapters.
- Names reflect responsibility:
  - `...Service` for workflow or browser-backed behavior
  - `...Adapter` for third-party or browser API boundaries
  - `...Runtime` for page-level orchestration
- Local forwarding helpers are not mislabeled as `bridge`, `facade`, or `dependencies` unless they really adapt a boundary.

### 6. State Ownership

- It is obvious where transient UI state lives.
- It is obvious where longer-lived page/runtime state lives.
- The same state is not mirrored across multiple layers without a clear reason.

### 7. Storybook and Test Readiness

- The component has focused Storybook coverage for its main visible states.
- The component has focused controller and rendered-behavior tests.
- Storybook harnesses stay small; large harnesses are treated as feedback that the boundary is still too broad.

## Accepted Exceptions

Not every module needs full `Controller + View + createComponent`.

These are acceptable when they stay narrow and explicit:

- page runtimes
- document-level modal services
- status presenter services
- browser/file/download/clipboard/timer adapters
- shell/layout-only components with little or no user-intent logic

If one of those starts owning feature workflow behavior, it should usually be promoted into a fuller component or runtime/service boundary.

## Audit Snapshot

This is the current repo-level audit after the latest Storybook and generator runtime simplification passes.

### Clean Or Close To Clean

- `RowCountControl`
  - Strong example of the intended pattern: focused controller, focused view, thin factory, clear Storybook coverage.
- `SharedSchemaDefinition`
  - Large but honest feature boundary. The controller/view/component split is real, visible, and Storybook-reviewable.
- `SchemaPanel`
  - Good shared host wrapper around the shared schema-definition surface with app/generator host configuration injected from outside.
- `PopulationModeSelector`
  - Small, focused, reviewer-facing component boundary.
- `PopulationActions`
  - Small, focused, reviewer-facing action surface with host-configured labels/help.
- `TestDataPopulationToolbar`
  - Good composed toolbar boundary that keeps app-specific composition outside the lower shared controls.
- `DataPopulationPanel`
  - Good feature composition boundary around toolbar plus shared schema panel.
- `GeneratorPreview`
  - Close to clean MVC. Visible behavior is inside the feature boundary and Storybook now exposes it directly.
- `Instructions`
  - Honest shared component with a small surface and clear host-configured behavior.
- `FormatOptionsPanel`
  - Honest shared feature boundary with declarative panel definitions kept outside the visible component view.
- `OptionsPreviewSplitLayout`
  - Clean focused view component for one visible layout responsibility.

### Acceptable Service Or Shell Exceptions

- `StatusPresenter`, `LoadingStatusPresenter`, and timed-status helpers
  - Service/presenter boundary is appropriate because they wrap one visible message surface rather than a fuller feature workflow.
- confirm/text-input dialog services and modal components
  - Document-level overlay behavior makes a service-style boundary acceptable.
- app and generator page shells
  - Functional layout shells are acceptable even when their controllers stay tiny or mostly structural.
- theme toggle
  - Acceptable component-backed shared service boundary.

### Main Remaining MVC Gaps

- `ImportExportWorkspace`
  - Now clean enough to treat as an honest MVC-style feature boundary.
  - The component entrypoint is thin, the runtime is lifecycle-and-wiring focused, and the async import/export/preview behavior now lives in [create-import-export-workspace-workflow-service.js](D:/github/grid-table-editor/packages/core-ui/js/gui_components/app/import-export-workspace/create-import-export-workspace-workflow-service.js).
  - The remaining follow-up here is only optional naming or micro-splits if a future change makes the workflow service too broad again.

- generator runtime dependency clusters
  - Much closer to clean MVC now.
  - The top runtime boot path is direct, the action/view-state cluster uses responsibility-based naming, and the schema layer now assembles through one direct builder: `create-generator-runtime-schema-runtime.js`.
  - The remaining question is whether the schema-generation helper should eventually be renamed or merged again, but the bigger wrapper pyramid is gone.

- `GeneratorControls`
  - Mostly good, but still slightly too broad visually.
  - The next Storybook-driven split remains the output-format selector, so the component surface can expose that visible choice area independently instead of only as one region inside the larger controls component.

- `TextPreviewEditor`
  - The re-audit justified one more visible split.
  - `TextPreviewEditor` now composes a dedicated `TextPreviewToolbar` for the Preview/Edit control cluster, which leaves the parent editor closer to an honest textarea-plus-split-layout boundary.

## Recommended Next Cleanup Order

1. Decide whether the remaining generator schema-generation helper should stay separate or be renamed as a service in a future cleanup.

## Short Review Questions

When reviewing any existing component, ask:

- Can I find the real user-intent logic in one controller or one clearly named runtime/service?
- Is the view only rendering and binding rooted DOM behavior?
- Is the factory mostly wiring, or is it secretly the feature brain?
- Are service names honest about what they do?
- Can Storybook review this visible surface directly without bootstrapping a much larger feature?

If the answer to two or more of those is "no", the component is probably not clean MVC yet.
