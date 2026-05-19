---
sidebar_position: 170
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
| `value` | `string\|number\|boolean` | yes | Literal value to return. |

Examples:

```txt
literal.value("value")
```

```txt
literal.value(value="value")
```

Example return values:
- `Pending`
