---
sidebar_position: 1
title: "Python"
description: "Python is a programming language with data structures that can represent tabular data as dictionaries and lists. You can export grid data as Python dictionaries or class instances in AnyWayData.com."
---

Python is a programming language and the AnyWayData Python option is likely most useful to Python developers.

## What is Python Data Output?

Python can represent table-like data using collections of dictionaries or collections of objects.

For example, a list of dictionaries:

```
data = [
    {
        "user": "Jesse.Bradtke97",
        "name": "Corine"
    },
    {
        "user": "Cielo.Little",
        "name": "Zander"
    }
]
```

In the example above:

- each row is represented as a dictionary using key/value pairs
- dictionary keys come from the column headers
- dictionaries are collected in a Python list

AnyWayData can also generate class-instance output where each row is represented as a named Python object.

## How is Python Output different from JSON and Javascript?

JSON is a language-independent data format and JavaScript object arrays are JavaScript syntax.

Python output uses Python syntax and Python concepts:

- strings can use single or double quotes
- `None` can be used for blank values
- values can be emitted as `Decimal(...)` for precise decimal handling
- rows can be emitted as dictionaries or class instances

Unlike JSON, Python output is designed to be used directly in Python code.

## AnyWayData Support for Python

AnyWayData currently supports **exporting** data to Python format.

You can configure output options such as:

- quote handling
- number handling
- decimal conversion rules
- pretty print indentation
- optional import statements
- dictionary vs class-instance output

Python output can be generated from the same grid data used for the other supported export formats.


## Unit Test Code Generation

You can also generate data-driven test scaffolding for Python using frameworks: `pytest`, `unittest`, `nose2`.

For more information, see [Unit Test Code Generation](/docs/data-formats/unit-test-code).

