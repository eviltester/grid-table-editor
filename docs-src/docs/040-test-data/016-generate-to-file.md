---
sidebar_position: 1.6
title: "Generate to File"
description: "Use generate.html for schema-first data generation with output preview and direct file download."
---

The **Generate to File** workflow is available at:

- `https://anywaydata.com/generate.html`

It is designed for schema-driven generation where your main goal is to produce output files quickly.

## What this page is best for

- defining data-generation schema without manual grid editing overhead
- previewing generated rows before export
- applying format-specific output options
- downloading generated output directly

## Typical workflow

1. Define schema rows (column name, source/type, value rule).
2. Set row count for preview or generation.
3. Select output format.
4. Configure format options.
5. Generate and download the result.

## Generation rule types

You can define columns using:

- `Faker`
- `RegEx`
- `Literal`
- `Enum` (including pairwise combinatorial generation)

For detailed rule behavior, see:

- [Faker Based Data](/docs/test-data/faker-test-data)
- [Regex Based Data](/docs/test-data/regex-test-data)
- [Literal Data](/docs/test-data/literal-test-data)
- [All Pairs Combinatorial Testing](/docs/test-data/pairwise-testing)

## Pairwise generation

When your schema includes two or more enum-driven fields, you can use pairwise generation to reduce test-case volume while still covering all value pairs.

See [All Pairs Combinatorial Testing](/docs/test-data/pairwise-testing) for details.

## Relationship to `app.html`

Use `generate.html` when file output speed and schema-driven generation are the priority.

Use `app.html` when you need richer interactive table editing before or after generation.

See [Data Grid Editable](/docs/test-data/data-grid-editable).
