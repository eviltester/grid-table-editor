---
sidebar_position: 4
title: "Literal Data"
description: "Generate static test data values using the Literal data option. Literal values are fixed text and are repeated for every generated row."
---

# Literal Data Generation

Literal data is the simplest data generation option.

A literal value is static text. The exact text is used for every generated row.

Use literal data when you want stable, predictable values rather than random values.

## When to use Literal values

Literal values are useful for:

- fixed environment labels, e.g. `UAT`, `PROD`, `local`
- default flags, e.g. `enabled`, `active`, `pending`
- seeded values for specific test scenarios
- columns that should remain constant while other columns vary

## Basic Example

Schema text format uses:

- column name
- generation rule

For a literal column:

```text
Environment
UAT
```

If you generate 5 rows, every row in `Environment` will be `UAT`.

## Multiple Literal Columns

You can define several static columns at once:

```text
Country
UK
Currency
GBP
Status
ACTIVE
```

This is useful for creating baseline datasets quickly.

## Mixed Example: Literal + Faker + Regex

Literal values are often combined with Faker and Regex columns.

```text
Environment
UAT
Customer Name
person.fullName
Order Ref
[A-Z]{3}-[0-9]{6}
Is Premium
true
```

In this example:

- `Environment` is always `UAT`
- `Customer Name` varies per row using Faker
- `Order Ref` varies per row using Regex
- `Is Premium` is always `true`

## Tips

- Use Literal for columns that should not vary.
- Use Faker/Regex for variability and realism.
- Keep literal values simple and explicit so generated data is easy to reason about.

You can read more about the other generation modes here:

- [Regex Based Data](/docs/test-data/regex-test-data)
- [Faker Based Data](/docs/test-data/faker-test-data)
