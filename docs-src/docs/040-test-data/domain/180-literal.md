---
sidebar_position: 180
title: "literal Domain"
description: "Domain keyword reference for literal."
---

# literal Domain

The `literal` domain returns caller-provided values directly and does not invoke faker.

## Methods

### `literal.value`

Return the literal value provided by the caller.

- Canonical: `awd.domain.literal.value`
- Docs: [https://anywaydata.com/docs/category/generating-data](https://anywaydata.com/docs/category/generating-data)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string\|number\|boolean` | no | Literal value to return. When omitted, defaults to an empty string. |

Examples:

```txt
literal.value("Pending")
```

```txt
literal.value("")
```

Example return values:
- `Pending`
