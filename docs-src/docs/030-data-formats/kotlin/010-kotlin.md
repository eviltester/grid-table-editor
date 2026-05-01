---
title: "Kotlin"
description: "Kotlin output exports tabular grid data as Kotlin code using maps or named data class instances."
---

Kotlin export lets you generate Kotlin-ready source code from grid data.

## What is Kotlin Data Output?

AnyWayData can export each row as either:

- an anonymous map
- a named data class instance

Rows are wrapped in either `listOf(...)` or `arrayOf(...)`.

## How is Kotlin output different from JSON?

JSON is a language-neutral data format.

Kotlin output uses Kotlin syntax directly, including:

- `val` variable assignment
- map rows with `"key" to value`
- optional data class definition and instance rows
- Kotlin-safe identifier handling (keyword escaping with backticks)
- normalized `PascalCase` class names for generated data classes

## AnyWayData Support for Kotlin

AnyWayData currently supports exporting data to Kotlin format.

See [Kotlin Options](/docs/data-formats/kotlin/options) for configuration details.
