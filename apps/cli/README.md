# AnyWayData CLI (`apps/cli`)

Unified CLI implementation for Node and Bun, backed by `@anywaydata/core`.

This workspace is the source of truth for:

- npm/npx CLI usage (`anywaydata`)
- Node runtime entrypoint (`src/node-entry.js`)
- Bun runtime entrypoint (`src/bun-entry.js`)
- Bun executable builds

## Quick Start

Install globally:

```bash
npm install -g @anywaydata/cli
```

Run with npx:

```bash
npx @anywaydata/cli --help
```

Run from repo with Node:

```bash
node apps/cli/src/node-entry.js --help
```

Run from repo with Bun:

```bash
bun run apps/cli/src/bun-entry.js --help
```

## Example Usage

Generate 3 rows from a spec file:

```bash
anywaydata generate -i exampleTestDataSpec.txt -n 3
```

Write to an output file:

```bash
anywaydata generate -i exampleTestDataSpec.txt -n 3 -o output.csv
```

Redirect stdout:

```bash
anywaydata generate -i exampleTestDataSpec.txt -n 3 > output.csv
```

Use included examples in this workspace:

```bash
anywaydata generate -i ./apps/cli/examples/company-literal.txt -n 3 -f csv
anywaydata generate -i ./apps/cli/examples/company.txt -n 3 -f csv
anywaydata generate -i ./apps/cli/examples/regex-field.txt -n 3 -f csv
anywaydata amend --schema-file schema.txt --data-file input.csv --input-format csv -f json -o amended.json
```

## CLI Options

- `-i, --inputfile` input text spec path (required)
- `-n, --numberOfLines` row count (required, overridden to `1` by `--testMode`)
- `-f, --format` output format (e.g. `csv`, `json`, `jsonl`, `xml`, `sql`)
- `-o, --outputfile` optional output file path
- `-t, --testMode` generate one row and print diagnostics/example output
- `--show-progress` force progress logs on/off
- `--stream` enable stream mode when supported
- `--stream-threshold` auto-enable stream mode when rows >= threshold and output file is set (default `5000`)
- `--unsafe-faker-expressions` allow expression-style faker args (unsafe for untrusted input)
- `amend --schema-file <file> --data-file <file> --input-format <format>` amend existing input data with schema rules

## Streaming Behavior

Streaming is currently supported for:

- `csv`
- `jsonl`
- `dsv`
- `json`
- `xml`

Notes:

- `json` stream mode emits a valid JSON array payload.
- For stream-mode option mismatches, generation continues and warnings are reported when applicable.
- Other formats use buffered generation.

For `amend`, streaming flags are accepted for compatibility but ignored (always buffered).

Examples:

```bash
anywaydata generate -i ./apps/cli/examples/company-literal.txt -n 100000 -f jsonl -o output.jsonl --stream
anywaydata generate -i ./apps/cli/examples/company-literal.txt -n 100000 -f csv -o output.csv --stream-threshold 1000
anywaydata generate -i ./apps/cli/examples/company-literal.txt -n 100000 -f dsv -o output.dsv --stream
anywaydata generate -i ./apps/cli/examples/company-literal.txt -n 100000 -f json -o output.json --stream
anywaydata generate -i ./apps/cli/examples/company-literal.txt -n 100000 -f xml -o output.xml --stream
```

## Spec File Format

The test data spec format is two lines per field:

1. Column name
2. Rule/spec for that column

Example:

```text
Column Name 1
Data Value Spec for Column Name 1
Column Name 2
Data Value Spec for Column Name 2
```

### Literal Value Example

```text
Company
AnyWayData
```

### Faker Value Example

```text
Company
company.name
```

Faker API docs:

- https://fakerjs.dev/api/

### Regex Value Example

```text
Regex Generated Field
[A-Z]{3,6}[0-9]{0,6}
```

## Safe vs Unsafe Faker Expressions

CLI is safe-by-default. For untrusted specs, keep default behavior.

To allow expression-style faker arguments, opt in explicitly:

```bash
anywaydata generate -i input.txt -n 10 -f csv --unsafe-faker-expressions
```

## Build Bun Executables

Build a Bun executable from the shared entrypoint:

```bash
bun build ./apps/cli/src/bun-entry.js --compile --target=bun-linux-x64 --outfile ./out/linux-x64/anywaydata
```

Cross-platform targets follow the same pattern:

- `bun-windows-x64`
- `bun-linux-x64`
- `bun-linux-arm64`
- `bun-darwin-arm64`

See Bun executable docs:

- https://bun.sh/docs/bundler/executables
