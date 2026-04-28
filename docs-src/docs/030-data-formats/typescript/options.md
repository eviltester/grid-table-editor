---
sidebar_position: 2
title: "TypeScript Options"
description: "Options available for converting to TypeScript in AnyWayData.com. This includes collection and object style, variable assignment, number conversion, and pretty print formatting."
---

The configuration options for TypeScript are listed below.

## Collection Type

Choose whether the outer container is generated as:

- `List (Array<T>)`
- `Array [ ]`

In generated output this maps to `Array<T>` or `T[]` type annotations.

## Assign to Variable

When enabled, output is assigned to a typed variable.

For example:

```ts
const data: Array<Record<string, unknown>> = [
    {"name": "Monica"}
];
```

## Variable Name

Set the name used when `Assign to Variable` is enabled.

For example, using `records`:

```ts
const records: Array<Record<string, unknown>> = [
    {"name": "Monica"}
];
```

## Number Convert (Quote Numbers)

When enabled, numeric-looking values are emitted as quoted strings.

When disabled, numeric-looking values are emitted as numeric literals.

## Use Anonymous Objects

When enabled, each row is output as an anonymous object literal.

When disabled, each row is output as an instance of a named TypeScript class.

## Class Name

Used when `Use Anonymous Objects` is disabled to set the class name for generated row instances.

## Blank Values

Choose how blank values are exported:

- `null`
- `Empty String`

## Pretty Print

Controls whether output is formatted across multiple lines with indentation.

When disabled, output is compact (minified style).

## Delimiter

Controls indentation when `Pretty Print` is enabled.

TypeScript supports:

- `Tab [\t]`
- `Space [ ]`
- `Custom Value`

## Custom Delimiter

Set a custom indentation value used for pretty print.

For TypeScript output, indentation must be whitespace. Non-whitespace values automatically fall back to safe spaces.
