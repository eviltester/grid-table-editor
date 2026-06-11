---
sidebar_position: 1.8
title: "Schema Definition"
description: "Full reference for schema text format, field rules, and IF ... THEN schema constraints."
---

The schema editor in `app.html` and `generate.html` uses a plain text format.

This page explains:

- how field rules are written
- how schema constraints are written
- which operators are supported
- how constraints affect generated data
- copy-paste examples you can use directly in the tool

## Basic schema format

A schema is usually written as repeating two-line field definitions:

```text
Column Name
rule definition
```

Example:

```text
Status
enum("Open","In Progress","Closed")
```

This creates one output column called `Status`.

You can also use a compact inline form when you prefer a PICT-style layout:

```text
Status: enum("Open","In Progress","Closed")
```

Both formats are supported, and you can mix them in the same schema.

## Field rule examples

### Literal values

Use a literal when every generated row should contain the same value.

```text
Build
literal(1.0.0)
```

This always generates `1.0.0`.

### Enum values

Use an enum when the column should be chosen from a fixed set of values.

```text
Priority
enum("High","Medium","Low")
```

This generates one of `High`, `Medium`, or `Low`.

### Regex values

Use a regex when the value should match a pattern.

```text
Ticket Id
[A-Z]{3}-\d{4}
```

This generates values such as `ABC-1234`.

### Domain and Faker-style methods

Use a domain method for realistic generated values.

```text
Customer Name
person.fullName
```

This generates names such as `Alice Smith`.

## Comments and blank lines

You can use blank lines to make a schema easier to read.

Lines starting with `#` are treated as comments.

Example:

```text
# Core workflow fields
Priority
enum("High","Medium","Low")

# User-facing status
Status
enum("Open","Closed")
```

## Schema constraints

Schema constraints restrict which combinations of values are allowed.

The currently supported constraint form is:

```text
IF predicate THEN predicate
```

You can terminate a constraint with either:

- `;`
- `ENDIF`

Both of these are valid:

```text
IF [Priority] = "High" THEN [Status] = "Open";
```

```text
IF [Priority] = "High" THEN [Status] = "Open" ENDIF
```

## What constraints do

Constraints do not assign or mutate values after generation.

Instead, they define which rows are valid.

The generator creates candidate rows, checks them against the constraints, and keeps only rows that satisfy all constraints.

For example:

```text
Priority
enum("High","Low")
Status
enum("Open","Closed")

IF [Priority] = "High" THEN [Status] = "Open";
```

Meaning:

- rows with `Priority = High` are only valid if `Status = Open`
- rows with `Priority = Low` can have either `Open` or `Closed`

So `High` + `Closed` should never appear in generated output.

## Parameter references

Inside constraints, column names must be written in square brackets:

```text
[Priority]
[Status]
[Ticket Id]
```

Important:

- use the exact schema column name
- bracketed names are required inside constraints
- spaces are allowed inside the brackets

Example:

```text
IF [Ticket Status] = "Open" THEN [Resolution Code] = "";
```

## Supported operators

### Equality and comparison

Supported comparison operators are:

- `=`
- `<>`
- `>`
- `>=`
- `<`
- `<=`

Example:

```text
IF [Age] >= 18 THEN [Access Level] = "Adult";
```

Notes:

- use `<>` for "not equal"
- `!=` is not supported

### LIKE

`LIKE` checks a wildcard pattern.

Supported wildcard characters are:

- `*` for any number of characters
- `?` for a single character

Example:

```text
IF [Code] LIKE "QA-*" THEN [Environment] = "Test";
```

Meaning:

- if `Code` starts with `QA-`, then `Environment` must be `Test`

### NOT LIKE

Example:

```text
IF [Code] NOT LIKE "QA-*" THEN [Environment] = "Production";
```

Meaning:

- if `Code` does not start with `QA-`, then `Environment` must be `Production`

### IN

`IN` checks whether a value is one of a listed set.

The current schema format uses curly braces:

```text
IF [Priority] IN {"High","Critical"} THEN [Escalated] = "Yes";
```

Meaning:

- if `Priority` is either `High` or `Critical`, then `Escalated` must be `Yes`

### NOT IN

Example:

```text
IF [Priority] NOT IN {"High","Critical"} THEN [Escalated] = "No";
```

Meaning:

- if `Priority` is neither `High` nor `Critical`, then `Escalated` must be `No`

## Logical operators

Supported logical operators are:

- `AND`
- `OR`
- `NOT`

You can also use parentheses for grouping.

### AND example

```text
IF [Priority] = "High" AND [Status] = "Open" THEN [Owner] <> "";
```

Meaning:

- when both conditions are true, `Owner` must not be blank

### OR example

```text
IF [Region] = "UK" OR [Region] = "IE" THEN [Currency] = "GBP";
```

Meaning:

- if the region is `UK` or `IE`, then currency must be `GBP`

### NOT example

```text
IF NOT ([Status] = "Closed") THEN [Remaining Work] <> "0";
```

Meaning:

- if status is not `Closed`, then remaining work must not be `0`

## Constraint value types

Constraints can compare against:

- quoted string values, e.g. `"Open"`
- numeric values, e.g. `18`
- other parameters, e.g. `[Min Age] <= [Max Age]`

### Parameter-to-parameter comparison

```text
Min Age
number.int({"min": 18, "max": 50})
Max Age
number.int({"min": 18, "max": 65})

IF [Min Age] > [Max Age] THEN [Max Age] >= [Min Age];
```

Meaning:

- any row where `Min Age` is greater than `Max Age` is only valid if `Max Age` is at least `Min Age`
- in practice, this prevents invalid min/max ordering

## Validation rules for constraints

Constraints are validated against the schema.

### Unknown columns are rejected

This is invalid because `[Severity]` is not defined in the schema:

```text
Priority
enum("High","Low")

IF [Severity] = "Critical" THEN [Priority] = "High";
```

### Invalid enum values are rejected

This is invalid because `Urgent` is not in the enum:

```text
Priority
enum("High","Medium","Low")

IF [Priority] = "Urgent" THEN [Priority] = "High";
```

### Invalid regex values are rejected

This is invalid because `bob` does not match the regex:

```text
Ticket Id
[A-Z]{3}-\d{4}

IF [Ticket Id] = "bob" THEN [Status] = "Open";
```

### Impossible literal comparisons are rejected

This is invalid because the only literal value is `Closed`:

```text
Status
literal(Closed)

IF [Status] = "Closed" THEN [Status] = "Open";
```

## Generation-time constraint failures

Some constraints are syntactically valid and can reference valid columns and values, but still make row generation impossible.

These cases are not always discoverable during schema parsing or validation. They may only be found when the generator starts creating rows and repeatedly fails to find a valid combination.

Example:

```text
Status
enum("Open","Closed")

IF [Status] = "Open" THEN [Status] = "Closed";
IF [Status] = "Closed" THEN [Status] = "Open";
```

Illustrates:

- a schema that parses correctly
- constraints that use valid enum values
- a rule set that makes every possible row invalid

Meaning:

- if `Status` is `Open`, the row is only valid when `Status` is `Closed`
- if `Status` is `Closed`, the row is only valid when `Status` is `Open`
- no generated row can satisfy both possibilities

When this happens, the tool reports:

`Schema Constraints are impacting row generation - generated X rows, failed to generate Y rows. Consider changing constraints to improve row generation.`

Important:

- this condition is only found and reported during generation
- care must be taken when writing constraints, especially when combining multiple rules
- a schema can be structurally valid but still impossible to generate data from

## Pairwise and n-wise constraints

Constraints are supported during pairwise and n-wise generation only when every referenced constrained field is an enum column.

That means:

- constrained pairwise and n-wise generation works best for enum-only decision tables
- if a constraint references non-enum fields such as regex, literal, or domain-generated values, normal random generation is supported, but combinatorial generation is not

## Copy-paste examples

Each example below is complete and can be pasted directly into the tool.

### Example 1: Basic enum dependency

Illustrates:

- enum fields
- simple equality constraint

```text
Priority
enum("High","Medium","Low")
Status
enum("Open","Queued","Closed")

IF [Priority] = "High" THEN [Status] = "Open";
```

Meaning:

- `High` priority rows must use `Open`

### Example 2: Multiple allowed trigger values with IN

Illustrates:

- `IN`
- set-based trigger conditions

```text
Priority
enum("Critical","High","Medium","Low")
Escalated
enum("Yes","No")

IF [Priority] IN {"Critical","High"} THEN [Escalated] = "Yes";
```

Meaning:

- `Critical` and `High` rows must be escalated

### Example 3: NOT IN inverse rule

Illustrates:

- `NOT IN`
- inverse constraint logic

```text
Priority
enum("Critical","High","Medium","Low")
Escalated
enum("Yes","No")

IF [Priority] NOT IN {"Critical","High"} THEN [Escalated] = "No";
```

Meaning:

- `Medium` and `Low` rows must not be escalated

### Example 4: Regex-triggered routing

Illustrates:

- regex field definition
- `LIKE`

```text
Ticket Id
[A-Z]{3}-\d{4}
Queue
enum("Support","QA","Ops")

IF [Ticket Id] LIKE "QA-*" THEN [Queue] = "QA";
```

Meaning:

- values starting with `QA-` must use the `QA` queue

### Example 5: Combined conditions with AND

Illustrates:

- `AND`
- multiple field dependency

```text
Priority
enum("High","Low")
Status
enum("Open","Closed")
Owner
enum("Alice","Bob","")

IF [Priority] = "High" AND [Status] = "Open" THEN [Owner] <> "";
```

Meaning:

- a high-priority open item must have an owner

### Example 6: Grouped logic with OR and parentheses

Illustrates:

- `OR`
- parentheses

```text
Region
enum("UK","IE","US","CA")
Currency
enum("GBP","USD","CAD")

IF ([Region] = "UK" OR [Region] = "IE") THEN [Currency] = "GBP";
```

Meaning:

- both `UK` and `IE` rows must use `GBP`

### Example 7: Numeric comparison

Illustrates:

- numeric comparison
- `>=`

```text
Age
number.int({"min": 16, "max": 21})
Access
enum("Restricted","Adult")

IF [Age] >= 18 THEN [Access] = "Adult";
```

Meaning:

- anyone aged 18 or older must have `Adult` access

### Example 8: Using ENDIF instead of semicolon

Illustrates:

- `ENDIF` terminator

```text
Priority
enum("High","Low")
Status
enum("Open","Closed")

IF [Priority] = "High" THEN [Status] = "Open" ENDIF
```

Meaning:

- same as the semicolon form
- the choice of terminator is author preference

## Summary

Use schema constraints when generated rows need business rules, dependencies, or realistic combinations.

The most important points are:

- write schema fields as column/rule pairs
- reference columns in constraints with `[Bracketed Names]`
- use `IF ... THEN ...`
- terminate constraints with `;` or `ENDIF`
- use `<>` rather than `!=`
- use constraints to filter invalid rows, not to mutate rows after generation
