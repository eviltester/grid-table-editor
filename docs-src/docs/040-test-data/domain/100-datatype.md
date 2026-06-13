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

```txt
datatype.boolean()
```

```txt
datatype.boolean(probability=1)
```

Example return values:
- `true`
