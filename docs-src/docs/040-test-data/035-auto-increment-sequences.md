---
sidebar_position: 35
title: "Auto Increment Sequences"
description: "Generate sequential values that only advance when a row is accepted."
---

# Auto Increment Sequences

`autoIncrement.sequence` generates a sequential value for each accepted row.

Unlike a plain counter that advances on every attempt, this sequence only advances when the row is kept. If a row is rejected by schema constraints and retried, the skipped attempt does not consume the next number.

## Basic Usage

```txt
Id
autoIncrement.sequence()
```

Example output:

```txt
1
2
3
```

## Start and Step

```txt
Build
autoIncrement.sequence(start=10, step=5)
```

Example output:

```txt
10
15
20
```

## Prefix, Suffix, and Zero Padding

```txt
Filename
autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)
```

Example output:

```txt
filename001.txt
filename006.txt
filename011.txt
```

`zeropadding=3` means the numeric portion is padded to a total width of three digits, so `1` becomes `001`, `100` stays `100`, and `1000` stays `1000`.

## Constraint-Aware Sequences

This command is especially useful when you generate rows under constraints.

```txt
Ticket
autoIncrement.sequence(prefix="T-", zeropadding=4)
Priority
enum(High,Low)
Status
enum(Open,Closed)

IF [Priority] = "High" THEN [Status] = "Open";
```

If a generated row fails the constraint and is retried, the ticket sequence does not skip a value.

## Parameters

- `start`
  Starting integer. Defaults to `1`.
- `step`
  Non-zero increment between accepted rows. Defaults to `1`.
- `prefix`
  Optional text before the number.
- `suffix`
  Optional text after the number.
- `zeropadding`
  Optional integer padding amount. Defaults to `0`.

## See Also

- [Domain Test Data](/docs/test-data/domain/domain-test-data)
- [Schema Definition](/docs/test-data/Schema-Definition)
