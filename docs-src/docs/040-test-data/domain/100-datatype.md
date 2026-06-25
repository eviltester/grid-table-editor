---
sidebar_position: 100
title: "datatype Domain"
description: "Domain keyword reference for datatype."
---

# datatype Domain

The `datatype` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/datatype](https://fakerjs.dev/api/datatype)

## Methods

### `datatype.boolean`

Returns the boolean value true or false.

- Canonical: `awd.domain.datatype.boolean`
- Faker docs: [https://fakerjs.dev/api/datatype](https://fakerjs.dev/api/datatype)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `probability` | `number` | no | Probability threshold for returning true (between 0 and 1). |

Examples:

Shows datatype.boolean when optional params are omitted.

```txt
datatype.boolean()
```

Returns: `true`

Shows datatype.boolean using probability.

```txt
datatype.boolean(probability=0.5)
```

Returns: `true`

### `datatype.enum`

Enum helper accepts CSV values or a string array and returns one value at random. Bare CSV is supported as schema shorthand; function calls use quoted strings, arrays, or named arguments.

- Canonical: `awd.domain.datatype.enum`

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `values` | `comma-separated list\|array` | yes | List of allowed enum values chosen at random during generation. Named csv="..." is also accepted as a CSV-string alias for this argument. |

Examples:

Shows the canonical datatype enum helper using a named CSV argument. The same public enum can also be authored as enum("active","inactive","pending") or the schema shorthand active,inactive,pending.

```txt
datatype.enum(csv="active,inactive,pending")
```

Returns: `inactive`

Shows the string-array form for values that should be parsed directly instead of as CSV text. The fully-qualified compatibility alias awd.datatype.enum(...) also normalizes to this same datatype.enum command internally.

```txt
datatype.enum(values=["GET","POST","PUT","PATCH"])
```

Returns: `PUT`
