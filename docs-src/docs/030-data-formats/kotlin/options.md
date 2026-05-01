---
title: "Kotlin Options"
description: "Options available when exporting to Kotlin, including collection type, number conversion, object style, variable naming, and pretty print delimiter settings."
---

The configuration options for Kotlin are listed below.

## Collection Type

Choose the outer collection syntax:

- `array` for `arrayOf(...)`
- `list` for `listOf(...)`

## Assign to Variable

When enabled, output is assigned to a named variable like:

```kotlin
val data = listOf(...)
```

Use **Variable Name** to configure the assigned name.

### Mutable Assignment

Choose whether assignment uses:

- `val` (default, immutable reference)
- `var` (mutable reference)

## Number Convert

When enabled, numeric-looking values are quoted as strings.

When disabled, numeric-looking values are emitted as numeric literals.

## Anonymous Objects

When enabled, each row is output as a map (`mapOf(...)`).

When disabled, each row is output as an instantiated object, and a data class definition is included.

Use **Object Name** to configure the class name when anonymous objects are disabled.

Object names are normalized to Kotlin `PascalCase` for generated data class declarations.

## Mutable Collections

When enabled:

- row maps are emitted as `mutableMapOf(...)`
- outer list collections use `mutableListOf(...)` when collection type is `list`

Array collection type remains `arrayOf(...)`.

## Pretty Print

When enabled, output uses line breaks and indentation.

### Delimiter

Choose indentation delimiter:

- tab
- space
- custom value

For custom value, set **Custom Delimiter**.

### Trailing Comma

Control whether the final row in pretty-printed collections includes a trailing comma.
