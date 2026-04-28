---
sidebar_position: 2
title: "JSONL Options"
description: "Options available for converting to JSONL in AnyWayData.com. JSONL output is one JSON object per line and only supports number conversion."
---

The configuration options for JSONL are listed below.

## Number Convert

The `Number Convert` option detects numeric-looking values and outputs them as JSON numbers instead of strings.

With `Number Convert` off:

```json
{"name":"Monica","age":"29"}
```

With `Number Convert` on:

```json
{"name":"Monica","age":29}
```

## Fixed JSONL Behavior

JSONL in AnyWayData is always generated as compact line-delimited output:

- one JSON object per line
- no wrapping array (`[]`)
- no named wrapper property
- no pretty print

For output that supports `Pretty Print`, `As Object`, and `Property Name`, use [JSON options](/docs/data-formats/json/options).
