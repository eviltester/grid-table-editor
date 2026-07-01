---
slug: auto-increments-helpers
authors: [alan]
tags: [release, feature]
date: 2026-06-30T10:00
---

This release expands the commands available in the domain model, allows more helper functions in the UI and has general UI improvements.

<!-- truncate -->

## 1. Auto-increment timestamps for deterministic event streams

You can now generate timestamps that move forward one row at a time instead of relying on purely random dates.

Example:

```text
CreatedAt
autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds")
```

That produces:

- row 1: `2026-06-12T12:39:23Z`
- row 2: `2026-06-12T12:39:24Z`
- row 3: `2026-06-12T12:39:25Z`

This is useful for audit logs, event streams, ordered API records, and any test data where time should progress predictably across generated rows.

Docs:

- [autoIncrement Domain](/docs/test-data/domain/autoIncrement)


## 2. Constraint-aware auto-increment sequences for generated identifiers

Schemas can now generate sequential IDs through the domain model with `autoIncrement.sequence`.

Example:

```text
Filename
autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)
```

Generated values:

```text
filename001.txt
filename006.txt
filename011.txt
```

This is especially useful for ticket IDs, filenames, and human-readable references because the sequence only advances when a row is accepted. If a generated row is rejected by constraints and retried, the skipped attempt does not consume the next number.

Docs:

- [Auto Increment Sequences](/docs/test-data/auto-increment-sequences)

## 3. Allow unsafe Faker helpers from the UI when you trust the schema

Faker helper commands stay safe by default. Simple literal helper calls continue to work normally, but expression-style helper arguments that execute callback-shaped schema text require an explicit opt-in.

That opt-in is now available in the Web UI as **allow unsafe faker** in the Test Data Settings dialog behind the cog.

Example unsafe helper:

```text
Names
helpers.multiple(() => this.person.firstName(), { count: 3 })
```

Use this only for schemas you trust. The browser setting now matches the other integration surfaces:

- Web UI: enable **allow unsafe faker** from the Test Data Settings cog.
- REST API: pass `unsafeFakerExpressions: true` in supported generation request bodies.
- CLI: pass `--unsafe-faker-expressions`.
- MCP: pass `unsafeFakerExpressions: true` in the generation tool arguments.

Docs:

- [Faker Helpers](/docs/test-data/faker/helpers)
- [Web UI](/docs/interfaces-and-deployment/web-ui)
- [REST API](/docs/interfaces-and-deployment/rest-api)
- [MCP](/docs/interfaces-and-deployment/mcp)
- [CLI](/docs/interfaces-and-deployment/cli-node-and-bun)


