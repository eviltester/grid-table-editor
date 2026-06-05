# Icon Standardization Plan

This plan defines how to replace ad hoc text, Unicode, and one-off legacy SVG icons with one consistent icon approach across the frontend UI. The implemented target is Lucide-style inline SVG icons, delivered through a small shared helper so plain JavaScript components can render icons without adopting a framework.

## Goals

- Standardize action and help icons across the supported Tabulator grid, shared controls, and option panels.
- Preserve existing hover text through `title` attributes where users already see browser-native hover labels.
- Preserve Tippy help and option tooltip behavior for `.helpicon[data-help]` and `.option-help-icon[data-help]`.
- Improve accessibility by giving icon-only controls stable `aria-label` text and hiding decorative SVGs with `aria-hidden="true"`.
- Keep icons theme-friendly by using `currentColor` and existing component/button color rules.
- Avoid new grid-specific icon dependencies for custom app actions.

## Non-Goals

- Do not redesign grid behavior, sorting, filtering, or column editing while replacing icons.
- Do not replace Tabulator or change grid-engine policy as part of this work.
- Do not remove visible text from primary text buttons such as `Add Row` unless the button is intentionally converted to an icon-only control with accessible labeling.
- Do not rewrite existing components solely to fit the icon work unless a local component boundary is already being touched.
- Do not replace Tippy itself; this plan keeps the existing tooltip service contract.

## Current Icon Surface

- Tabulator column header action text now flows through the shared column-header action helper in `packages/core-ui/js/gui_components/data-grid-editor/shared/column-header-action-buttons.js`.
- The composed Tabulator app grid header action text appears in `packages/core-ui/js/gui_components/data-grid-editor/data-grid-component-view.js`.
- Help icons use the `.helpicon` CSS class and are populated by `help-tooltips.js` with the shared `circle-help` inline SVG while preserving Tippy behavior.
- Several shared controls use text or Unicode symbols, including shared schema row actions in `packages/core-ui/js/gui_components/shared/test-data/schema/shared-schema-editor-ui.js`.
- Some grid chrome still uses third-party classes for built-in grid behavior. Those can remain until a separate grid-chrome replacement is intentionally planned.

## Icon Mapping

Use these mappings as the standard. Names are Lucide-style names, and the helper stores the small app-owned inline SVG allowlist locally.

- Add column left: `PanelLeftInsert` or a composed `ArrowLeft` + `Plus`
- Rename: `Pencil`
- Delete: `Trash2`
- Duplicate: `Copy`
- Add column right: `PanelRightInsert` or a composed `ArrowRight` + `Plus`
- Help/options help: `CircleHelp`
- Filter: `Filter`
- Sort ascending: `ArrowUp`
- Sort descending: `ArrowDown`
- Clear sort/remove: `X`
- Drag/reorder: `GripVertical`
- Add item/row/field: `Plus`
- Remove item/row/field: `Minus`
- Move up: `ArrowUp`
- Move down: `ArrowDown`
- Generate/download/file action where the file shape is currently CSS-drawn: `FilePlus`, `FileDown`, or `Sparkles` depending on the command meaning

## Tooltip And Text Preservation

- Keep native hover labels on icon-only action controls with `title`, using human-readable text such as `Add column left`, `Rename column`, `Delete column`, `Duplicate column`, and `Add column right`.
- Keep Tippy-backed help behavior by preserving `.helpicon[data-help]` and `.option-help-icon[data-help]` selectors unless `help-tooltips.js` is updated at the same time.
- Preserve any existing `data-help`, `data-help-text`, and `_tippy?.setContent(...)` update paths when replacing help icon markup.
- Use `aria-label` for every icon-only interactive element. The `aria-label` should match or clarify the `title`.
- Mark SVG children as `aria-hidden="true"` so screen readers announce the control label rather than the path contents.
- Do not move tooltip text into visible page text as part of the migration.

## Implementation Approach

- Add a shared icon helper under `packages/core-ui/js/gui_components/shared/primitives/icon/`.
- The helper should render inline SVG elements from a small allowlist of icon names used by the app.
- Use one public function for DOM creation and one for HTML-string rendering if both are needed by existing code paths.
- Keep icon sizing controlled through CSS classes, for example `.app-icon`, `.icon-button`, `.header-icon-button`, and `.helpicon`.
- Use `stroke="currentColor"` and avoid hard-coded fills except where an icon is intentionally filled.
- Prefer real `button type="button"` elements for interactive icon controls when the surrounding component can accept the markup change.
- Where a third-party grid formatter currently expects spans, keep behavior stable first, then migrate to buttons only when tests and grid event behavior confirm it is safe.
- Keep root-scoped selectors and `data-action` contracts intact where tests or page objects depend on them.

## Tests And Verification

- Update DOM/component tests whenever icon markup changes so queries use roles, accessible names, or stable `data-action` hooks.
- Add regression coverage that each icon-only control keeps the expected `title` and `aria-label`.
- Add or update tests for `.helpicon[data-help]` and `.option-help-icon[data-help]` so Tippy still attaches and dynamic help text still updates.
- Update Storybook stories for changed components so reviewers can see the icon states and hover the help/options icons.
- For grid header changes, run the UI gate in addition to the repo-local gate because the work changes frontend components and browser-facing grid behavior.

## Todo List

- [x] Confirm Lucide-style inline SVGs as the standard and vendor only the small app allowlist instead of installing a runtime package.
- [x] Create the shared icon primitive with DOM and HTML-string rendering helpers.
- [x] Add icon primitive tests for valid names, invalid names, accessibility attributes, and `currentColor` behavior.
- [x] Add shared CSS for icon sizing, alignment, button hit area, disabled state, hover state, focus-visible state, and dark-theme inheritance.
- [x] Replace Tabulator app grid header action text in `data-grid-component-view.js`.
- [x] Replace the old Tabulator popup header action text path and consolidate it onto the shared column-header action helper.
- [x] Preserve or improve tests for all column header actions: add left, rename, delete, duplicate, and add right.
- [x] Replace the legacy `.helpicon` asset with the shared help icon while keeping `.helpicon[data-help]` and `.option-help-icon[data-help]` behavior.
- [x] Update help tooltip tests so Tippy behavior, inline help fallback, and dynamic `data-help-text` updates still work.
- [x] Replace schema row action glyphs in the shared schema row renderer with standardized icons.
- [x] Review generator/file action icons and replace the CSS-drawn file icons with the standardized `file-plus` icon.
- [x] Keep affected Storybook stories rendering the real changed components; no story-only icon stubs were introduced.
- [x] Update Playwright page objects and tests that relied on old literal icon text or lowercase title selectors.
- [x] Remove obsolete Font Awesome comments, readme references, and the local `circle-question-solid.svg` asset after no code uses it.
- [x] Run `pnpm run verify:ui` after UI changes.
- [x] Run `pnpm run verify:local` before marking implementation complete.

## Additional Considerations

- Keyboard access: icon-only controls must remain reachable by keyboard and show a visible focus indicator.
- Hit target size: compact grid headers can use smaller visual icons, but the clickable area should remain comfortable and predictable.
- Layout stability: replacing text with SVGs should not change column header height unexpectedly or cause Tabulator header resize jitter.
- Theme support: icons should remain readable in light and dark themes without per-icon color overrides.
- High contrast: avoid communicating destructive or disabled state by color alone; keep labels and disabled attributes meaningful.
- Destructive actions: delete icons can have a warning hover/focus color, but confirmation/error behavior should remain controlled by existing guarded edit flows.
- Third-party formatters: Tabulator header formatters have event and markup constraints, so migrate them with focused tests.
- Accessible names: tests and Playwright should prefer role/name queries once markup uses real buttons.
- Legacy selector contracts: keep existing `data-action` and intentionally public IDs stable unless a migration explicitly updates docs and tests.
- Bundle size: if installing an icon package, import only specific icons and verify bundling does not pull the entire library.
- Licensing: document the icon source and license in the repo once the final icon delivery method is chosen.
- Visual consistency: use one stroke width, size scale, and alignment rule for shared icons so grid headers, help icons, and schema controls look like the same system.
