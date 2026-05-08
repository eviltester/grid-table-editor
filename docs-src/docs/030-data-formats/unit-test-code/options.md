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

### Strategy Availability by Framework

- `junit5`, `junit6`: `provider`, `inline`, `csv`
- `junit4`, `testng`, `pytest`, `unittest`, `nose2`, `jest`, `vitest`, `mocha`, `xunit`, `nunit`, `mstest`: `provider`, `inline`
- `rspec`, `minitest`, `phpunit`, `pest`, `kotest`, `junit5-kotlin`, `spek`, `test-more`, `test2-suite`: `provider`

## includeSetup Mapping by Framework

When `includeSetup` is enabled, AnyWayData generates framework-idiomatic setup scaffolding:

- JUnit4: `@Before`
- JUnit5/6: `@BeforeEach`
- TestNG: `@BeforeMethod`
- PyTest: fixture scaffold
- unittest: `setUp`
- nose2: `setUp`
- Jest: `beforeEach`
- Vitest: `beforeEach`
- Mocha: `beforeEach`
- xUnit: constructor setup
- NUnit: `[SetUp]`
- MSTest: `[TestInitialize]`
- RSpec: `before`
- Minitest: `setup`
- PHPUnit: `setUp()`
- Kotest: `beforeTest`
- JUnit5 Kotlin: `@BeforeEach`
- Spek: `beforeEachTest`
- Test::More: setup variable scaffold
- Test2::Suite: setup variable scaffold

## Official Framework References

- JUnit 4: https://junit.org/junit4/
- JUnit 5 (Jupiter): https://junit.org/junit5/
- TestNG: https://testng.org/
- pytest: https://docs.pytest.org/
- unittest: https://docs.python.org/3/library/unittest.html
- nose2: https://docs.nose2.io/
- Jest: https://jestjs.io/
- Vitest: https://vitest.dev/
- Mocha: https://mochajs.org/
- xUnit.net: https://xunit.net/
- NUnit: https://nunit.org/
- MSTest: https://learn.microsoft.com/dotnet/core/testing/unit-testing-with-mstest
- RSpec: https://rspec.info/
- Minitest: https://github.com/minitest/minitest
- PHPUnit: https://phpunit.de/
- Pest: https://pestphp.com/
- Kotest: https://kotest.io/
- JUnit 5 for Kotlin (Jupiter): https://junit.org/junit5/
- Spek: https://spekframework.github.io/
- Test::More: https://metacpan.org/pod/Test::More
- Test2::Suite: https://metacpan.org/pod/Test2::Suite
