---
sidebar_position: 2
title: "SQL Options"
description: "Options available for SQL export in AnyWayData.com: table name, batching, numeric quoting, SQL dialect, identifier quoting, transaction wrappers, and null handling."
---

The configuration options for SQL export are listed below.

## Table Name

`Table Name` sets the target table used in the generated SQL.

Default: `myTable`

Example:

```sql
INSERT INTO myTable (...) values (...);
```

## Max Values

`Max Values` controls how many row tuples are added in a single `INSERT` statement.

Default: `100`

If there are more rows than this value, AnyWayData creates additional `INSERT` statements.

For example with `Max Values = 2`, five data rows would generate three insert statements.

## Quote Numeric

`Quote Numeric` controls whether numeric-looking values are emitted as strings or numbers.

When enabled (default), numeric-looking values are quoted:

```sql
('Monica','29')
```

When disabled, numeric-looking values are emitted without quotes:

```sql
('Monica',29)
```

This can help when loading into strongly typed numeric columns.

## Dialect

`Dialect` controls SQL dialect-specific behavior for quoted identifiers and transaction wrappers.

Supported values:

- `ANSI SQL`
- `PostgreSQL`
- `MySQL`
- `SQL Server`

## Quote Identifiers

`Quote Identifiers` controls whether table names and column names are quoted in the generated SQL.

When enabled, quoting style follows the selected `Dialect`:

- ANSI/PostgreSQL: `"identifier"`
- MySQL: `` `identifier` ``
- SQL Server: `[identifier]`

This helps avoid issues with reserved words, spaces, and special characters in headers.

## Null Handling

`Null Handling` controls how empty values and NULL-like text are exported.

Available modes:

- `Keep Empty As ''` - empty values are generated as empty strings.
- `Empty As NULL` - empty values become unquoted `NULL`.
- `Empty Or NULL Literal As NULL` - empty values and `NULL` text become unquoted `NULL`.

## Wrap Transaction

`Wrap Transaction` adds transaction wrapper statements around generated INSERT statements.

The wrapper syntax follows the selected `Dialect`, e.g.:

- MySQL: `START TRANSACTION;` ... `COMMIT;`
- SQL Server: `BEGIN TRANSACTION;` ... `COMMIT TRANSACTION;`
- ANSI/PostgreSQL: `BEGIN;` ... `COMMIT;`
