---
sidebar_position: 40
title: "autoIncrement Domain"
description: "Domain keyword reference for autoIncrement."
---

# autoIncrement Domain

The `autoIncrement` domain provides stateful sequence helpers for accepted generated rows.

## Methods

### `autoIncrement.sequence`

Generates an incrementing sequence. Values only advance when a generated row is accepted, so constraint-filtered rows do not consume sequence numbers.

- Canonical: `awd.domain.autoIncrement.sequence`
- Docs: [https://anywaydata.com/docs/test-data/auto-increment-sequences](https://anywaydata.com/docs/test-data/auto-increment-sequences)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `start` | `integer` | no | Starting integer in the sequence. Defaults to 1. |
| `step` | `integer` | no | Amount added after each accepted row. Defaults to 1. |
| `prefix` | `string` | no | Optional text added before the numeric portion. |
| `suffix` | `string` | no | Optional text added after the numeric portion. |
| `zeropadding` | `integer` | no | Minimum zero-padding size for the numeric portion. A value of 3 renders 1 as 0001. Defaults to 0. |

Examples:

```txt
autoIncrement.sequence()
```

```txt
autoIncrement.sequence(start=10, step=5)
```

```txt
autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)
```

Example return values:
- `1`
- `15`
- `filename0001.txt`
