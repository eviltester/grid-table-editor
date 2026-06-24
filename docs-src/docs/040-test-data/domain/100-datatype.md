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

Enum helper accepts a list of values and returns one value at random. Supports enum(value1,value2), enum value1,value2, or datatype.enum(value1,value2).

- Canonical: `awd.domain.datatype.enum`

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `values` | `comma-separated list` | yes | List of allowed enum values chosen at random during generation. |

Examples:

Shows the canonical datatype enum helper using a named values argument. The same public enum can also be authored as enum("active","inactive","pending"), enum active,inactive,pending, active,inactive,pending, or "active","inactive","pending".

```txt
datatype.enum(values="active,inactive,pending")
```

Returns: `inactive`

Shows a second named-parameter example with a different enum set. The fully-qualified compatibility alias awd.datatype.enum(...) also normalizes to this same datatype.enum command internally.

```txt
datatype.enum(values="GET,POST,PUT,PATCH")
```

Returns: `PUT`
