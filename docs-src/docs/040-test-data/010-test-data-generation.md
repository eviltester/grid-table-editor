---
sidebar_position: 1
title: "Test Data Generation"
description: "Overview of test-data generation workflows in app.html and generator.html."
---

AnyWayData offers two main web UI workflows for generating and working with test data:

- **Data Grid Editable** (`app.html`) for interactive grid-first editing and generation
- **Generate to File** (`generator.html`) for schema-driven generation and direct file output

## Choose a Workflow

### Data Grid Editable (`app.html`)

Use this when you want to:

- edit/import/export table data directly in a grid
- define generation rules and generate rows into the same editable grid
- refine data interactively before exporting

See [Data Grid Editable](/docs/test-data/data-grid-editable).

### Generate to File (`generator.html`)

Use this when you want to:

- define a schema and preview generated rows
- configure output format-specific options
- generate and download output directly as a file

See [Generate to File](/docs/test-data/generate-to-file).

## Data Types

Both workflows support generation rules such as:

- `Literal`
- `RegEx`
- `Faker`
- `Enum` (including pairwise combinations when applicable)

## Learn More About Rule Types

- [Literal Data](/docs/test-data/literal-test-data)
- [Regex Based Data](/docs/test-data/regex-test-data)
- [Faker Based Data](/docs/test-data/faker-test-data)
- [Counterstrings](/docs/test-data/counterstrings)
- [Domain Test Data](/docs/test-data/domain/domain-test-data)
- [All Pairs Combinatorial Testing](/docs/test-data/pairwise-testing) - Generate optimal test combinations from enum data
