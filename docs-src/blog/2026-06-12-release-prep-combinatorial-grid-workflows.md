---
slug: release-prep-combinatorial-grid-workflows
title: 'Release Prep: Stronger Combinatorial Generation and Faster Grid Workflows'
authors: [alan]
tags: [release, feature, combinatorial, schema, import, export, ux]
date: 2026-06-12T10:00
---

The next release is centered on one theme: faster paths from existing data to realistic, constrained, exportable test sets.

This release adds broader combinatorial generation, schema authoring improvements, better import/export controls, and a few high-value grid usability upgrades.

<!-- truncate -->

## 1. Auto-increment timestamps for deterministic event streams

You can now generate timestamps that move forward one row at a time instead of relying on purely random dates.

Example:

```text
CreatedAt
autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds")
```

That produces:

- row 1: `2026-06-12T12:39:23Z`
- row 2: `2026-06-12T12:39:24Z`
- row 3: `2026-06-12T12:39:25Z`

This is useful for audit logs, event streams, ordered API records, and any test data where time should progress predictably across generated rows.

Docs:

- [autoIncrement Domain](/docs/test-data/domain/autoIncrement)

## 2. N-wise combinatorial generation, not just pairwise

The biggest addition is that combinatorial generation now goes beyond pairwise.

Instead of stopping at 2-wise coverage, you can now choose stronger coverage levels for enum-driven schemas and compare strategies before generating.

Example schema:

```text
Browser: Chrome,Firefox,Safari
Device: Desktop,Tablet,Mobile
Locale: en-GB,en-US,fr-FR
Theme: Light,Dark
```

With this schema you can choose:

- `2-wise` to cover every pair of enum values
- `3-wise` to cover every triplet
- stronger levels when you need more interaction coverage

This is especially useful when pairwise is too light, but full Cartesian generation would explode the row count.

Docs:

- [N-Wise Testing](/docs/test-data/n-wise-testing)
- [Pairwise Testing](/docs/test-data/pairwise-testing)

![N-wise combinations dialog](/img/release-198/n-wise-generation.png)

## 3. Schema constraints with PICT-style `IF ... THEN ...`

Schema constraints make generated combinations more realistic by filtering out invalid rows.

Example:

```text
Priority
enum("High","Medium","Low")
Status
enum("Open","Queued","Closed")
Escalated
enum("Yes","No")

IF [Priority] = "High" THEN [Status] = "Open";
IF [Priority] IN {"High","Medium"} THEN [Escalated] = "Yes";
```

This means:

- high-priority items must be open
- high and medium priorities must be escalated

Constraints work well with enum-heavy decision tables and combinatorial generation, giving you more realistic output without manually cleaning results afterward.

Docs:

- [Schema Definition](/docs/test-data/Schema-Definition)

## 4. Grid to Enum Schema for turning existing tables into generators

If you already have representative data in the main grid, you can now turn that grid into an enum schema automatically.

Example grid:

```text
Browser,Device,Theme
Chrome,Desktop,Light
Firefox,Mobile,Dark
Chrome,Tablet,Dark
```

Generated schema:

```text
Browser
enum("Chrome","Firefox")
Device
enum("Desktop","Mobile","Tablet")
Theme
enum("Light","Dark")
```

This is one of the most practical workflow improvements in the release because it shortens the path from imported examples to reusable generation rules.

Docs:

- [Data Grid Editable](/docs/test-data/data-grid-editable)

![Grid to enum schema in the app](/img/release-198/grid-to-enum-schema.png)

## 5. PICT-style inline enum definitions such as `Name: values`

Schema text now fits more naturally with compact PICT-style authoring.

Example:

```text
Browser: Chrome,Firefox,Safari
Theme: Light,Dark
Priority: enum("High","Medium","Low")
Owner: person.fullName
```

That means you can mix:

- raw inline enum values
- explicit `enum(...)`
- other command-based field definitions

This makes it easier to paste or adapt schemas from existing combinatorial models instead of rewriting them into a stricter two-line format.

Docs:

- [Schema Definition](/docs/test-data/Schema-Definition)

## 6. Import trimming controls for cleaner amend and import workflows

Imported files and clipboard data can now be normalized during import.

You can trim:

- every imported field value
- only selected fields

Example selected fields list:

```text
Name, Email
```

This helps when imported files contain accidental whitespace around values, but you do not want to aggressively rewrite every column.

Docs:

- [Import From File](/docs/editing-data/import-from-file)

![Import trim settings](/img/release-198/import-trim-settings.png)

## 7. File export settings for line endings and BOM

Downloads now support file transport settings without changing the preview text shown in the browser.

You can configure:

- `LF` or `Windows (CR/LF)` line endings
- optional UTF-8 `BOM`

This is useful when exporting for spreadsheets, Windows tooling, or downstream systems that are sensitive to file encoding details.

Docs:

- [Exporting Data](/docs/editing-data/exporting-data)

![Download encoding settings](/img/release-198/export-encoding-settings.png)

## 8. Right-click context menu in the main data grid

The editable grid now has a right-click context menu for common grid actions.

This keeps more of the workflow close to the current selection and makes the app feel more like a direct data-work surface rather than a form with a grid attached to it.

Docs:

- [Data Grid Editable](/docs/test-data/data-grid-editable)

## 9. Always-visible total row counts in the data grid

The main grid now shows total row counts, and filtered views also show how many rows remain visible.

Examples:

```text
Total rows: 125
```

```text
Total rows: 125 | Filtered Visible: 12
```

It is a small change, but it removes friction during import checks, filtered analysis, and post-generation review.

Docs:

- [Data Grid Editable](/docs/test-data/data-grid-editable)

## Why should you care?

Taken together, these features make the tool better at moving through the whole workflow:

1. start with imported or hand-edited data
2. convert it into a schema
3. add constraints
4. generate the right amount of combinatorial coverage
5. export in the format and file encoding you actually need

The release adds more generation power, reduces setup time, and cleanup time around that generation.
