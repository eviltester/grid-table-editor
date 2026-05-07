---
slug: unit-test-export-frameworks
title: "Unit-Test Export Frameworks Across UI, REST, and MCP"
authors: [alan]
tags: [release, feature, unit-test, codegen, api, mcp, ui]
date: 2026-05-07T11:30
---

We added a dedicated **Code (Unit Test)** export capability that now works consistently across the UI, REST API, and MCP tool interfaces.

Generated output is data-driven (parameterized) test code, with shared options for suite naming, setup scaffolding, pretty print, and data source strategy.

<!-- truncate -->

## Code vs Code (Unit Test)

- `Code` export outputs plain data structures in a programming language (for example arrays/objects/maps) that you can use anywhere in application code.
- `Code (Unit Test)` export outputs parameterized test scaffolding for a specific unit test framework, including test-case feeding and assertion skeletons.

In short: `Code` is data-as-code; `Code (Unit Test)` is test-scaffold-as-code.

## What Is Included

Supported frameworks:

- Java: `junit4`, `junit5`, `junit6`, `testng`
- Python: `pytest`, `unittest`, `nose2`
- JavaScript: `jest`, `vitest`, `mocha`
- C#: `xunit`, `nunit`, `mstest`
- Ruby: `rspec`, `minitest`
- PHP: `phpunit`, `pest`
- Kotlin: `kotest`, `junit5-kotlin`, `spek`
- Perl: `test-more`, `test2-suite`

## Interfaces

The same output formats are available in:

- Web UI: `Code (Unit Test)` tab with language-specific framework options
- REST: existing `/v1/generate` and `/v1/generate/fromschema` endpoints via `outputFormat`
- MCP: existing generation tool format enum/options

## Example: Generated Vitest Unit Test

```ts
import { describe, expect, it } from 'vitest';

const rows = [
  { Name: 'Connie', Age: 21 },
  { Name: 'Miles', Age: 34 },
];

describe('GeneratedDataTests', () => {
  it.each(rows)('row_parameterized_%#', (row) => {
    const actual = mapRowUnderTest(row);
    expect(actual['Name']).toStrictEqual(row['Name']);
    expect(actual['Age']).toStrictEqual(row['Age']);
  });
});

function mapRowUnderTest(input: Record<string, unknown>) {
  // Replace with your SUT call, e.g. return userMapper.normalize(input);
  return input;
}
```

## Docs

The detailed option behavior and framework mapping are documented here:

- [Unit Test Code Options](/docs/data-formats/unit-test-code/options)

## Official Framework References

- JUnit 4: [junit.org/junit4](https://junit.org/junit4/)
- JUnit 5 (Jupiter): [junit.org/junit5](https://junit.org/junit5/)
- JUnit 6: [docs.junit.org/6.0.3](https://docs.junit.org/6.0.3/overview.html)
- TestNG: [testng.org](https://testng.org/)
- pytest: [docs.pytest.org](https://docs.pytest.org/)
- unittest: [docs.python.org unittest](https://docs.python.org/3/library/unittest.html)
- nose2: [docs.nose2.io](https://docs.nose2.io/)
- Jest: [jestjs.io](https://jestjs.io/)
- Vitest: [vitest.dev](https://vitest.dev/)
- Mocha: [mochajs.org](https://mochajs.org/)
- xUnit.net: [xunit.net](https://xunit.net/)
- NUnit: [nunit.org](https://nunit.org/)
- MSTest: [Microsoft MSTest docs](https://learn.microsoft.com/dotnet/core/testing/unit-testing-with-mstest)
- RSpec: [rspec.info](https://rspec.info/)
- Minitest: [github.com/minitest/minitest](https://github.com/minitest/minitest)
- PHPUnit: [phpunit.de](https://phpunit.de/)
- Pest: [pestphp.com](https://pestphp.com/)
- Kotest: [kotest.io](https://kotest.io/)
- Spek: [spekframework.github.io](https://spekframework.github.io/)
- Test::More: [metacpan.org/pod/Test::More](https://metacpan.org/pod/Test::More)
- Test2::Suite: [metacpan.org/pod/Test2::Suite](https://metacpan.org/pod/Test2::Suite)
