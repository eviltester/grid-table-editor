---
title: Method Picker UI Spec
---

# Method Picker UI Spec

## Purpose
Replace schema `type/method` dropdown editing with a shared modal picker that supports:
- Fast search by command, summary, params, and examples
- Domain/Faker discovery with recent history
- Inline schema definition help (summary, params, examples)
- Light and dark theme support

## Scope
Applies to both schema-editing surfaces:
- Generator schema rows
- Embedded test-data schema grid (Tabulator + AG Grid)

## Functional Requirements
- Open picker from command/type editor cells and command row controls.
- Search input filters on:
  - command key (`domain.method`, `helpers.method`)
  - help summary
  - parameter names
  - help example text
- Tabs: `All`, `Core`, domain category tabs, `Faker`, `Recently used`.
- `Core` includes built-in schema primitives: `enum`, `literal`, `regex`.
- Initial tab defaults by source type:
  - faker rows open on `Faker`
  - enum/literal/regex rows open on `Core`
  - domain rows open on `All`
- Selection applies only:
  - `sourceType` (domain/faker/enum/literal/regex)
  - `command`
- Existing row `params`/`value` fields are preserved.

## Information Architecture
- Left/center results list: command tiles with name, summary, source tag.
- Right details panel:
  - Summary
  - Schema heading/signature
  - Parameter Details table (name/details) shown first
  - Parameter Types table (name/type/required) shown second
  - Example block
- Footer actions: `Cancel`, `Apply`.

## Keyboard + Accessibility
- `/` focuses search when modal is open.
- `Esc` closes without applying.
- `Enter` in search selects top result.
- Dialog uses `role="dialog"` and `aria-modal="true"`.
- Search field and actions are keyboard reachable.

## Theming
- Uses body theme classes already used by app:
  - `body.theme-light`
  - `body.theme-dark`
- Modal styling is token-based via CSS custom properties (`--mp-*`) with separate light/dark values.
- Focus, contrast, selected state, and borders are theme-aware.

## Data + Metadata Sources
- Command lists:
  - domain: visible domain catalog (`getVisibleDomainCommands`)
  - faker: approved `helpers.*` commands
  - top-level schema types: `enum`, `literal`, `regex`
- Help metadata:
  - `buildSchemaHelpModel(...)`

## State Model
- Modal local state:
  - active tab
  - search term
  - selected command
  - prepared options with prebuilt search text
- Persisted state:
  - recent selections in localStorage key `anywaydata.method-picker.recent`

## Non-Goals
- No auto-population of `params` or `value`.
- No backend/API changes.
- No forced migration of existing schema text format.

## Test Coverage Expectations
- Unit:
  - Filtering and search match behavior
  - Cancel vs apply behavior
  - Metadata rendering (params/examples)
- Browser:
  - Open, search, select, apply across both surfaces
  - Existing generation flows continue working
  - Theme readability in light/dark

## Compatibility Notes
- Generator keeps a hidden command `<select>` for interaction-test compatibility while the visible control is the new modal picker.
- Grid editors commit through existing `success`/`stopEditing` flows to preserve sync semantics.
