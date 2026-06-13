---
sidebar_position: 25
title: "autoIncrement Domain"
description: "Domain keyword reference for autoIncrement."
---

# autoIncrement Domain

The `autoIncrement` domain provides deterministic values that move forward for each generated row.

## Methods

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
