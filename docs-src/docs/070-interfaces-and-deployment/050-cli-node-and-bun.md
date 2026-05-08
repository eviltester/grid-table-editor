---
sidebar_position: 5
title: "CLI (Node and Bun)"
description: "Use AnyWayData from the command line with npm/Node or Bun."
---

Use the CLI for local scripting, CI steps, and one-off batch generation.

## When To Use This

- You want command-line generation from text specs.
- You want output to stdout or a file in scripts.

## Node/npm CLI

Global install:

```bash
npm install -g @anywaydata/cli
```

Run without installing:

```bash
npx @anywaydata/cli --help
```

Common examples:

```bash
anywaydata --help
anywaydata generate -i input.txt -n 10 -f csv
anywaydata generate -i input.txt -n 10 -f json -o output.json
anywaydata generate -i input.txt -n 10 -f markdown -t
```

Parameter guide for the examples:

- `generate`: run the data generation command.
- `-i, --inputfile`: path to the schema/input text file.
- `-n, --numberOfLines`: number of rows to generate.
- `-f, --format`: output format (for example `csv`, `json`, `markdown`, `sql`).
- `-o, --outputfile`: optional output file path. If omitted, output is written to stdout.
- `-t, --testMode`: generate one row and print diagnostics for troubleshooting.
- `--show-progress`: explicitly control progress logs (`true` or `false`).
- `--stream`: enable streaming generation when supported (currently `csv` and `jsonl`).
- `--stream-threshold`: auto-enable streaming when `rowCount >= threshold` and `--outputfile` is set (default `5000`).
- `--unsafe-faker-expressions`: opt-in to expression-style faker arguments (unsafe for untrusted input).
- `--help`: show CLI usage and options.

## Behavior Notes

- `--testMode` always forces generation to a single row (`rowCount = 1`) and prints diagnostic/example output.
- Progress output defaults to:
  - on for stdout mode (no `--outputfile`)
  - on for `--testMode`
  - off for file output unless `--show-progress true` is provided
- Streaming is currently implemented for `csv` and `jsonl` exports. Other formats use buffered generation.
- Auto-streaming (`--stream-threshold`) applies only when writing to a file. For stdout workflows, use `--stream` explicitly.

Example `input.txt` schema file:

```text
Name
person.fullName
Email
internet.email
JoinedOn
date.past
```

This input format is the same schema format used in the Generating Data docs:
- [Generating Data](/docs/category/generating-data)
- GitHub CLI examples: [https://github.com/eviltester/grid-table-editor/tree/master/apps/cli/examples](https://github.com/eviltester/grid-table-editor/tree/master/apps/cli/examples)

## Bun CLI

From the repo root of [grid-table-editor](https://github.com/eviltester/grid-table-editor), you can run the Bun CLI entrypoint in `apps/cli`.

```bash
bun run apps/cli/src/bun-entry.js --help
bun run apps/cli/src/bun-entry.js generate -i input.txt -n 10 -f csv
bun run apps/cli/src/bun-entry.js generate -i input.txt -n 100000 -f jsonl -o output.jsonl --stream
```

If your environment uses a Bun-built binary/workflow, follow the same argument pattern.

## Safe Faker Expressions

Node and Bun CLIs are safe-by-default for faker arguments.

To allow expression-style faker arguments, opt in explicitly:

```bash
anywaydata generate -i input.txt -n 10 -f csv --unsafe-faker-expressions
```

## Choose CLI vs API/MCP

- Choose **CLI** for local scripts and shell pipelines.
- Choose [REST API](/docs/interfaces-and-deployment/rest-api) for HTTP integrations and OpenAPI.
- Choose [MCP](/docs/interfaces-and-deployment/mcp) for stdio tool integrations with MCP hosts.
