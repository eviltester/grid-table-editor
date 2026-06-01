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

## Storybook

Storybook is a review, documentation, and lightweight interaction-example layer. It is not the primary automated test layer.

- Each story should teach a real state or behavior mode.
- If a story visibly renders a child component, that child should behave for real unless the story visibly replaces it with a placeholder.
- Prefer role/name queries in `play` functions and assert the meaningful state the story is meant to demonstrate.
- Story defaults and docs should make the intended behavior easy to explore.

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

- `packages/core-ui/js/gui_components/data-grid-editor/tabulator/main-display-grid.js` remains as a grid-runtime facade around the componentized Tabulator grid.
- `enableTestDataGenerationInterface` remains as a legacy alias for `mountTestDataGenerationPanel`; internal app code uses the newer component-oriented name.
