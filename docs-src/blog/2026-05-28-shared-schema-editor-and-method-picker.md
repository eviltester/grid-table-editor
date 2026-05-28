---
slug: shared-schema-editor-and-method-picker
title: "Shared Schema Editor and New Method Picker: Faster, Clearer Test Data Setup"
authors: [alan]
tags: [release, test-data, ux, schema]
date: 2026-05-28T11:30
---

We have rolled out a major test-data editing upgrade across both the main data grid editing `app` and direct to file test data `generator`.

The schema editing experience is now driven by one shared interface and a new method-picker dialog.

<!-- truncate -->

## What Changed

### One shared schema editor

Both pages now use the same schema-editing behavior for:

- switching between row mode and text mode
- row add/remove/reorder
- text-to-row and row-to-text synchronization
- sample schema insertion behavior
- command picker integration

Previously we had two different implementations, both prototypes, now we have refined the UI and made it consistent for both data generation approaches.

### 2. New method picker dialog replacing dropdown-heavy flow

Instead of relying on long dropdowns for method selection, we now use a searchable picker with:

- fast filter by command, summary, params, and examples
- partial text to filter commands so no more hunting around for the command in the category
- curated tabs including `All`, `Core`, domain categories, `Faker`, and `Recently used`
- a right-hand details panel with:
  - summary
  - schema signature
  - `Parameter Details` (description + examples)
  - `Parameter Types` (name/type/required)
  - usage and return examples
  - docs link when available

### 3. Better handling of core schema types

Core methods (`enum`, `literal`, `regex`) are first-class in the picker via the `Core` tab and remain available in `All`.


## Benefits to the User

### Faster setup, less scanning

Searchable command selection and grouped tabs reduce time spent hunting for methods.

### Fewer mistakes

Richer method metadata and examples reduce guesswork around params and expected outputs.

### More consistent workflows

Shared controller behavior means users can switch between app and generator without relearning edge cases.

## Practical Outcome

If you author schemas often, day-to-day editing should now feel:

- more predictable
- easier to scan
- less error-prone
- more consistent across surfaces

If you maintain tests, the shared behavior model should mean fewer page-specific exceptions and less brittle UI abstraction code.

