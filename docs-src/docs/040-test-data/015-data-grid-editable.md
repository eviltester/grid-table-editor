---
sidebar_position: 1.5
title: "Data Grid Editable"
description: "Use app.html for interactive, grid-first test-data editing and generation."
---

The **Data Grid Editable** workflow is the main app at:

- `https://anywaydata.com/app.html`

It is designed for interactive editing where generated data and manual edits happen in the same grid.

By 'opening' the `Test Data` section in the GUI it is possible to Generate a Data Grid filled with Random Data.

## What this page is best for

- importing and editing existing table data
- generating random data directly into the visible grid
- refining data by hand before exporting
- switching between many data formats quickly

## Test Data section in `app.html`

Open the `Test Data` section to define generation rules.

The definition grid acts as a schema/template:

- each row maps to one target output column
- choose a type (`Literal`, `RegEx`, `Enum`, `Faker`)
- configure row count with `How Many?`
- press `Generate` (or `Generate Pairwise` when applicable)

Generated rows are inserted into the main editable data grid.

## Grid to Enum Schema

The `Grid to Enum Schema` action scans the current main data grid and builds a schema definition from the values already in the table.

Use this when you already have example rows in the editable grid and want to quickly turn those values into `Enum` generation rules.

The generated schema uses:

- one schema row per grid column
- the current column header as the schema row name
- `Enum` as the source type for every generated row
- unique values collected in first-seen row order

### How it works

1. Open the `Test Data` section in `app.html`.
2. Press `Grid to Enum Schema`.
3. Enter a maximum number of enum values to keep for each column.
4. Confirm truncation if any column has more unique values than the chosen limit.
5. Review the generated schema and press `Generate` or `Generate Pairwise` as needed.

The limit prompt shows the largest unique-value count found in the scanned grid and uses a numeric input field to reduce entry mistakes.

The default value is:

- the largest column unique-value count when it is `256` or less
- `256` when the largest column has more than `256` unique values

If the chosen limit is lower than the number of unique values in one or more columns, then AnyWayData will ask for confirmation before truncating the schema. Truncation keeps the first values seen in current grid row order.

When accepted, the generated enum schema replaces the existing schema definition in the Test Data editor. The schema grid, schema text area, validation state, and pairwise button visibility are all refreshed automatically.

If the grid is empty, or no usable values can be extracted, then the existing schema is left unchanged.

Example source grid:

```text
Browser,Device,Theme
Chrome,Desktop,Light
Firefox,Mobile,Dark
Chrome,Tablet,Dark
```

Example generated enum schema:

```text
Browser
enum("Chrome","Firefox")
Device
enum("Desktop","Mobile","Tablet")
Theme
enum("Light","Dark")
```

## Generate Modes in the Grid

When generating in `app.html`, you can choose whether generation replaces data or amends existing rows:

- `New Table` clears/rebuilds the table from the schema and generates a fresh data set
- `Amend Table` updates the current table while preserving existing rows where possible
- `Amend Selected` applies generation only to selected rows in the main grid

These modes are useful when you want to iteratively enrich existing data instead of always starting from a blank table.

## Main grid context menu

The main editable grid also supports a right-click context menu for common grid actions.

Use it when you want to work directly in the grid without moving to another toolbar control first.

Typical uses include:

- adding or deleting rows
- adding or deleting columns
- grid-focused edit actions close to the current selection

This makes the editable grid feel more like a spreadsheet-style workspace during cleanup and refinement.

## Pairwise generation

When you configure two or more `Enum` fields, pairwise generation is available to create efficient combinatorial coverage sets.

See [All Pairs Combinatorial Testing](/docs/test-data/pairwise-testing).

## Schema text area support

When you add rows using the data grid, you will see the information is also copied into the text area in the right. This allows you to copy and paste schema definitions for re-use.

The Schema format in the Text Area uses the format

```
column name
type value
```

e.g.

```
column 1
1234
```

When no type is present it is assumed to be a Regex e.g. `1234` is a Regex that represents the string "1234"

## Schema constraints

Schema definitions can also include `IF ... THEN ...` constraints to restrict which combinations of generated values are valid.

Constraints are useful when one field controls another, for example:

- if `Priority` is `high` then `Status` must be `open`
- if `Country` is `US` then `State` must be a valid US state code
- if one value is selected then another value must not be used

Constraints are authored in schema text and are available from the `Schema Constraints` section when you are editing in schema row mode.

For the full schema format, supported operators, and copy-paste examples, see [Schema Definition](./018-Schema-Definition.md).

## Test Data Grid

The Test Data Grid contains the 'schema' or 'template' to use to generate data for the grid.

Each row represents a Column in the final data grid.

Add a new column by pressing the `+ Add Column` button.

You can rename the column by double clicking on the `Column Name` field.

The Type is the `type` of data that will be generated in the column. This can be a `Literal` (static text), a `RegEx` (Regular Expression), an `Enum` (comma-separated values), or one of the predefined random data types from Faker.

When you have 2 or more `Enum` type columns, the `Generate Pairwise` button will appear, allowing you to generate optimal combinatorial test data with complete pairwise coverage.

## Row count summary

The main data grid shows an always-visible total row count beneath the grid.

When filters are active, the summary also shows the filtered visible count.

Examples:

```text
Total rows: 125
```

```text
Total rows: 125 | Filtered Visible: 12
```

This makes it easier to confirm the effect of import, filtering, amend operations, and generated data volumes at a glance.

## Types

The Types of data available can be chosen from the drop down value.

The drop down is an `option` select so you can type in a filter e.g `email` and you will see any matching options for email.

## Number of Rows to Generate

Configure how many rows of data to generate by typing the numeric value in the `How Many?` text field.

e.g. to generate 1000 rows of data enter `1000` in the `How Many?` text input field.

## Generating Data

Press the `[Generate]` button to generate the data.

The schema in the Column Definition Data Grid will be used to generate the data.

All data generation happens in the browser so the amount of data you can generate is limited only by the performance and memory of your computer.
