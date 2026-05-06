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
- `--unsafe-faker-expressions`: opt-in to expression-style faker arguments (unsafe for untrusted input).
- `--help`: show CLI usage and options.

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
- GitHub CLI examples: [https://github.com/eviltester/grid-table-editor/tree/master/cli/examples](https://github.com/eviltester/grid-table-editor/tree/master/cli/examples)

## Bun CLI

From the repo root of [grid-table-editor](https://github.com/eviltester/grid-table-editor), you can run the Bun CLI in `cli/`.

```bash
bun run cli/index.ts --help
bun run cli/index.ts generate -i input.txt -n 10 -f csv
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
