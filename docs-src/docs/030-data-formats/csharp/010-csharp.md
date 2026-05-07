---
title: "C#"
description: "C# output exports tabular grid data as C# code using dictionaries or named class instances."
---

C# export lets you generate C#-ready source code from grid data.

## What is C# Data Output?

AnyWayData can export each row as either:

- an anonymous dictionary
- a named class instance

Rows are wrapped in either `new List<object> { ... }` or `new[] { ... }`.

## How is C# output different from JSON?

JSON is a language-neutral data format.

C# output uses C# syntax directly, including:

- `var` variable assignment
- dictionary rows with `{ "key", value }`
- optional class definition and object initializer rows

## AnyWayData Support for C#

AnyWayData currently supports exporting data to C# format.

See [C# Options](/docs/data-formats/csharp/options) for configuration details.


## Unit Test Code Generation

You can also generate data-driven test scaffolding for C# using frameworks: `xunit`, `nunit`, `mstest`.

For more information, see [Unit Test Code Generation](/docs/data-formats/unit-test-code/description).

