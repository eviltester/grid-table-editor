---
sidebar_position: 40
title: "autoIncrement Domain"
description: "Domain keyword reference for autoIncrement."
---

# autoIncrement Domain

The `autoIncrement` domain provides deterministic values that move forward for each generated row.

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
| `zeropadding` | `integer` | no | Total digit width for the numeric portion. A value of 3 renders 1 as 001, while 100 stays 100. Defaults to 0. |

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
- `filename001.txt`

### `autoIncrement.timestamp`

Generates a timestamp that starts from a fixed point and increments by the configured amount for each generated row.

- Canonical: `awd.domain.autoIncrement.timestamp`

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `start` | `string\|number` | no | Starting timestamp. Defaults to the generation run start time. Strings may be ISO-8601, a date-fns formatted value when `inputFormat` is provided, or a permissive natural-language date parsed with chrono-node. |
| `step` | `number` | no | Amount added for each generated row. Defaults to `1`. |
| `type` | `string` | no | Unit applied to `step` for each row. Supports `milliseconds`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `months`, or `years`. Defaults to `seconds`. |
| `outputFormat` | `string` | no | Output format. Defaults to ISO-8601 without milliseconds. Use `iso8601` for the default behaviour or a date-fns format string. |
| `inputFormat` | `string` | no | Optional date-fns parse format used only for `start` when that value is not ISO-8601. |

Examples:

```txt
autoIncrement.timestamp()
```

```txt
autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds")
```

```txt
autoIncrement.timestamp(start="20/03/1969", step=1, type="days", outputFormat="yyyy-MM-dd")
```

```txt
autoIncrement.timestamp(start="12-06-2026 12:39:23", step=15, type="minutes", outputFormat="yyyy-MM-dd HH:mm:ss", inputFormat="dd-MM-yyyy HH:mm:ss")
```

Example return values:
- `2026-06-12T12:39:23Z`
- `2026-06-12T12:39:24Z`
- `2026-06-12T12:39:25Z`
