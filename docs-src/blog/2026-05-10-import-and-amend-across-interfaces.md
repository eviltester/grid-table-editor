---
slug: import-and-amend-across-interfaces
title: "Import + Amend via Schema in API, CLI, and MCP"
authors: [alan]
tags: [release, feature, api, cli, mcp]
date: 2026-05-10T09:30
---

The **Import + Amend via Schema** flow is now available across all automation interfaces: REST API, CLI, and MCP.

You can now provide a schema plus existing input data, amend rows using schema rules, and get back the full resulting dataset in your requested output format.

<!-- truncate -->

## What Was Added

- REST: `POST /v1/generate/amend`
- CLI: `anywaydata amend --schema-file ... --data-file ... --input-format ...`
- MCP: `amend_data_from_spec`

All three share the same core behavior.

## Behavior

- `rowCount` defaults to imported row count.
- If `rowCount` is smaller, only first `N` rows are amended.
- Output always returns the full resulting dataset after amendment.
- `stream` is accepted for compatibility but ignored for amend operations (buffered mode only).

## Cross-Format Support

The flow supports import and export across formats, including:

- CSV input -> tab-delimited (`dsv`) output
- tab-delimited (`dsv`) input -> CSV output

## Why This Matters

- You can automate the same amend workflow previously available in UI.
- You can update existing datasets without rebuilding them from scratch.
- You can keep the same schema-driven logic across UI, REST, CLI, and MCP.

## Docs

- [REST API](/docs/interfaces-and-deployment/rest-api)
- [CLI (Node and Bun)](/docs/interfaces-and-deployment/cli-node-and-bun)
- [MCP](/docs/interfaces-and-deployment/mcp)

