---
sidebar_position: 2
title: "Python Options"
description: "Options available for converting to Python in AnyWayData.com. This includes collection and object style, quote and number controls, decimal handling, imports, and pretty print formatting."
---

The configuration options for Python are listed below.

## Collection Type

Choose whether the outer container is generated as:

- `List [ ]`
- `Tuple ( )`

## Assign to Variable

When enabled, output is assigned to a variable.

For example:

```
data = [
    {"name": "Monica"}
]
```

## Variable Name

Set the name used when `Assign to Variable` is enabled.

For example, using `records`:

```
records = [
    {"name": "Monica"}
]
```

## Quote Numbers

When enabled, numeric-looking values are emitted as quoted strings.

When disabled, numeric-looking values are emitted as numeric literals.

## Use Decimal Type

When enabled, decimal-looking values can be emitted as `Decimal("12.34")`.

If Decimal values are used, AnyWayData will include:

```
from decimal import Decimal
```

## Decimal Columns (CSV)

Use a comma-separated list of column names to control which columns are treated as Decimal candidates.

For example:

```
Money, Column 2
```

If left blank, Decimal conversion applies to all eligible columns.

## Treat Integers As Decimal

When enabled, integer-looking values in Decimal-scoped columns are also emitted as `Decimal(...)`.

For example:

```
Decimal("5")
```

## Blank Values

Choose how blank values are exported:

- `Empty String`
- `None`

## Quote Style

Choose whether strings and dictionary keys use:

- `Double Quotes`
- `Single Quotes`

## Pretty Print

Controls whether output is formatted across multiple lines with indentation.

When disabled, output is compact (minified style).

## Delimiter

Controls indentation when `Pretty Print` is enabled.

Python supports:

- `Tab [\t]`
- `Space [ ]`
- `Custom Value`

## Custom Delimiter

Set a custom indentation value used for pretty print.

For Python, indentation must be whitespace. Non-whitespace values automatically fall back to safe spaces.

## Include Imports

When enabled, import statements are included at the top of the output.

## Import Statements

Provide import statements, one per line.

For example:

```
from dataclasses import dataclass
from typing import List
```

## Anonymous Dicts

When enabled, each row is output as a plain dictionary.

When disabled, each row is output as an instance of a class.

## Class Name

Used when `Anonymous Dicts` is disabled to set the class name for generated row instances.
