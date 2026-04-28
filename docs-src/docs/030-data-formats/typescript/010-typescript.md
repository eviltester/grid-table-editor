---
sidebar_position: 1
title: "TypeScript"
description: "TypeScript is a typed superset of JavaScript and can represent tabular data as typed arrays of objects or class instances. You can export grid data as TypeScript-ready source in AnyWayData.com."
---

TypeScript is a strongly typed programming language and the AnyWayData TypeScript option is useful when you need typed, copy/paste-ready data for tests, fixtures, demos, and prototypes.

## What is TypeScript Data Output?

TypeScript can represent table-like data using arrays of anonymous objects or arrays of class instances.

For example, a typed array of anonymous objects:

```ts
const data: Array<Record<string, unknown>> = [
    {"user": "Jesse.Bradtke97", "name": "Corine"},
    {"user": "Cielo.Little", "name": "Zander"}
];
```

In the example above:

- each row is represented as an object literal using key/value pairs
- object keys come from the column headers
- row objects are collected in a typed TypeScript array

AnyWayData can also generate class-instance output where each row is represented as an instance of a named TypeScript class.

## How is TypeScript Output different from JSON and Javascript?

JSON is a language-independent data format and JavaScript object arrays are JavaScript syntax.

TypeScript output uses TypeScript syntax and typing concepts:

- rows can be emitted as anonymous object literals or named class instances
- output can be generated as `Array<T>` or `T[]`
- values can be emitted as quoted strings or numeric literals
- output can be assigned to a named, typed variable

Unlike JSON, TypeScript output is designed to be used directly in TypeScript code.

## AnyWayData Support for TypeScript

AnyWayData currently supports **exporting** data to TypeScript format.

You can configure output options such as:

- collection type (`Array<T>` or `T[]`)
- variable assignment and naming
- number conversion (quoted vs unquoted)
- anonymous-object vs class-instance output
- pretty print indentation and custom delimiter

TypeScript output can be generated from the same grid data used for the other supported export formats.
