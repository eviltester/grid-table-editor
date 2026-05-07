---
title: "Perl"
description: "Perl output exports tabular grid data as Perl code using hashes or blessed object instances."
---

Perl export lets you generate Perl-ready source code from grid data.

## What is Perl Data Output?

AnyWayData can export each row as either:

- an anonymous hash reference
- a blessed object instance

Rows are wrapped in either an array reference or a Perl list assignment.

## How is Perl output different from JSON?

JSON is a language-neutral data format.

Perl output uses Perl syntax directly, including:

- `my` variable assignment
- hash rows using `key => value`
- optional blessed object rows

## AnyWayData Support for Perl

AnyWayData currently supports exporting data to Perl format.

See [Perl Options](/docs/data-formats/perl/options) for configuration details.


## Unit Test Code Generation

You can also generate data-driven test scaffolding for Perl using frameworks: `test-more`, `test2-suite`.

For more information, see [Unit Test Code Generation](/docs/data-formats/unit-test-code).

