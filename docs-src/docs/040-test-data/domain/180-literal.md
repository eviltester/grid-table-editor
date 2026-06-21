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

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string\|number\|boolean` | no | Literal value to return. When omitted, defaults to an empty string. |

Examples:

Shows literal.value in use.

```txt
literal.value(value="Pending")
```

Returns: `Pending`

Shows literal.value in use.

```txt
literal.value(value="")
```

Returns: ``

Shows literal.value when optional params are omitted.

```txt
literal.value()
```

Returns: ``

Shows literal.value using value.

```txt
literal.value(value=1)
```

Returns: `1`
