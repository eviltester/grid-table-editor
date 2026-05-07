---
title: "Ruby"
description: "Ruby output exports tabular grid data as Ruby code using hashes or named class instances."
---

Ruby export lets you generate Ruby-ready source code from grid data.

## What is Ruby Data Output?

AnyWayData can export each row as either:

- an anonymous hash (map/dictionary style)
- a named class instance

Rows are then wrapped in an outer collection.

## How is Ruby output different from JSON?

JSON is a language-neutral data format.

Ruby output uses Ruby syntax directly, including:

- named variable assignment
- hash rows with `=>`
- optional class definition and object instantiation rows

## AnyWayData Support for Ruby

AnyWayData currently supports exporting data to Ruby format.

See [Ruby Options](/docs/data-formats/ruby/options) for configuration details.


## Unit Test Code Generation

You can also generate data-driven test scaffolding for Ruby using frameworks: `rspec`, `minitest`.

For more information, see [Unit Test Code Generation](/docs/data-formats/unit-test-code).

