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

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `start` | `integer` | no | Starting integer in the sequence. Defaults to 1. |
| `step` | `integer` | no | Non-zero amount added after each accepted row. Defaults to 1. |
| `prefix` | `string` | no | Optional text added before the numeric portion. |
| `suffix` | `string` | no | Optional text added after the numeric portion. |
| `zeropadding` | `integer` | no | Total digit width for the numeric portion. A value of 3 renders 1 as 001, while 100 stays 100. Defaults to 0. |

Examples:

Shows autoIncrement.sequence in use.

```txt
autoIncrement.sequence()
```

Returns: `1`

Shows autoIncrement.sequence in use.

```txt
autoIncrement.sequence(start=10, step=5)
```

Returns: `10`

Shows autoIncrement.sequence in use.

```txt
autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)
```

Returns: `filename001.txt`

Shows autoIncrement.sequence using start.

```txt
autoIncrement.sequence(start=10)
```

Returns: `10`

Shows autoIncrement.sequence using step.

```txt
autoIncrement.sequence(step=5)
```

Returns: `1`

Shows autoIncrement.sequence using prefix.

```txt
autoIncrement.sequence(prefix="filename")
```

Returns: `filename1`

Shows autoIncrement.sequence using suffix.

```txt
autoIncrement.sequence(suffix=".txt")
```

Returns: `1.txt`

Shows autoIncrement.sequence using zeropadding.

```txt
autoIncrement.sequence(zeropadding=3)
```

Returns: `001`

### `autoIncrement.timestamp`

Generates a timestamp that starts from a fixed point and increments by the configured amount for each generated row.

- Canonical: `awd.domain.autoIncrement.timestamp`

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `start` | `string\|number` | no | Starting timestamp. Defaults to the generation run start time. Valid examples include "2026-06-12T12:39:23Z", "20/03/1969", "12-06-2026 12:39:23", or a Unix timestamp like 1718195963000. |
| `step` | `number` | no | Amount added for each generated row. Defaults to 1. |
| `type` | `string` | no | Unit applied to step for each row. Supports milliseconds, seconds, minutes, hours, days, weeks, months, or years. Defaults to seconds. |
| `outputFormat` | `string` | no | Output format. Defaults to ISO-8601 without milliseconds. Use "iso8601" for the default behaviour or a custom pattern such as "yyyy-MM-dd HH:mm:ss". |
| `inputFormat` | `string` | no | Optional parse pattern used only for the start argument when you want to match a specific text shape such as "dd/MM/yyyy" or "dd-MM-yyyy HH:mm:ss". |

Examples:

Shows autoIncrement.timestamp in use.

```txt
autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds")
```

Returns: `2026-06-12T12:39:23Z`

Shows autoIncrement.timestamp in use.

```txt
autoIncrement.timestamp()
```

Returns: `2026-06-18T15:55:20Z`

Shows autoIncrement.timestamp in use.

```txt
autoIncrement.timestamp(start="20/03/1969", step=1, type="days")
```

Returns: `1969-03-20T12:00:00Z`

Shows autoIncrement.timestamp using a custom output format.

```txt
autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=15, type="minutes", outputFormat="yyyy-MM-dd HH:mm:ss")
```

Returns: `2026-06-12 12:39:23`

Shows autoIncrement.timestamp in use.

```txt
autoIncrement.timestamp(start="20/03/1969", inputFormat="dd/MM/yyyy", step=1, type="days")
```

Returns: `1969-03-20T00:00:00Z`

Shows autoIncrement.timestamp using start.

```txt
autoIncrement.timestamp(start="2026-06-12T12:39:23Z")
```

Returns: `2026-06-12T12:39:23Z`

Shows autoIncrement.timestamp using step.

```txt
autoIncrement.timestamp(step=1)
```

Returns: `2026-06-18T15:55:20Z`

Shows autoIncrement.timestamp using type.

```txt
autoIncrement.timestamp(type="seconds")
```

Returns: `2026-06-18T15:55:20Z`

Shows autoIncrement.timestamp using outputFormat.

```txt
autoIncrement.timestamp(outputFormat="iso8601")
```

Returns: `2026-06-18T15:55:20Z`

Shows autoIncrement.timestamp using inputFormat.

```txt
autoIncrement.timestamp(start="20/03/1969", inputFormat="dd/MM/yyyy")
```

Returns: `1969-03-20T00:00:00Z`
