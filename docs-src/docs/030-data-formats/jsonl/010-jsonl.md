---
sidebar_position: 1
title: "JSONL"
description: "JSONL (JSON Lines) stores one JSON object per line, making it practical for logs, streaming, and line-by-line processing. AnyWayData supports exporting table data as JSONL."
---

JSONL (also known as JSON Lines or NDJSON style output) is a text format where each line is a standalone JSON object.

## What is JSONL?

JSONL is similar to JSON arrays of objects, but without the wrapping array.

Instead of:

```json
[
  {"name":"Monica","age":29},
  {"name":"Ravi","age":31}
]
```

JSONL is written as:

```json
{"name":"Monica","age":29}
{"name":"Ravi","age":31}
```

This format is useful when processing files one row at a time, appending data, or streaming records.

## Official References

There is no single JSONL standard body, but the format is widely used.

A few useful references:

- [JSON Lines](https://jsonlines.org/)
- [NDJSON](https://github.com/ndjson/ndjson-spec)

## AnyWayData Support for JSONL

AnyWayData currently supports **exporting** table data as JSONL.

JSONL output in AnyWayData is intentionally line-based and compact:

- one object per line
- no wrapping `[]` array
- no object wrapper property
- no pretty-print formatting

If you need configurable formatting, use [JSON](/docs/data-formats/json/json) output instead.
