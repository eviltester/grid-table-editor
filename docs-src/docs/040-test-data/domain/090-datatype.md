---
sidebar_position: 90
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
| `probability` | `number` | no | Probability threshold for returning `true` (between `0` and `1`). |
| `value` | `number` | no | Numeric toggle for deterministic output: 0 returns false and 1 returns true. |

Examples:

```txt
datatype.boolean()
```

```txt
datatype.boolean(probability=1, value=1)
```

Example return values:
- `true`
