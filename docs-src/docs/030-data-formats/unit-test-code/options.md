---
sidebar_position: 2
title: "Unit Test Code Options"
description: "Options available for Unit Test Code export in AnyWayData.com, including framework, naming, setup, formatting, and data source strategy."
---

The configuration options for Unit Test Code export are listed below.

## Framework

Select the target unit-test framework to generate.

Examples include:

- Java: `junit4`, `junit5`, `junit6`, `testng`
- JavaScript/TypeScript: `jest`, `vitest`, `mocha`
- Python: `pytest`, `unittest`, `nose2`
- C#: `xunit`, `nunit`, `mstest`
- Ruby: `rspec`, `minitest`
- PHP: `phpunit`, `pest`
- Kotlin: `kotest`, `junit5-kotlin`, `spek`
- Perl: `test-more`, `test2-suite`

## Suite Name

Sets the generated top-level test container name.

Depending on framework this may be used as:

- class name
- describe/context label
- test module/container name

## Test Name Prefix

Sets the base name used for generated parameterized test methods/cases.

Framework renderers sanitize this value as needed for identifier safety.

## Include Setup

When enabled, generated output includes a setup scaffold (for example `beforeEach`, `setUp`, `[SetUp]`, fixture blocks, etc.).

When disabled, setup scaffolding is omitted.

## Pretty Print

Controls whether generated row data is expanded over multiple lines.

When disabled, row data is emitted in compact inline form where supported.

## Data Source Strategy

Controls how row data is supplied to tests:

- `provider`: generate a provider function/member and consume it from the test
- `inline`: embed row values directly in annotations/arrays/collections

Notes:

- strategy availability depends on framework
- for JUnit 5/6, legacy `csv` input is normalized to the `inline` strategy for compatibility
