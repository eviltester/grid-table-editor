---
sidebar_position: 0
id: domain-test-data
slug: /test-data/domain/domain-test-data
title: "Domain Test Data"
description: "Domain keyword abstraction reference and examples."
---

# Domain Test Data

Domain keywords provide a stable AnyWayData abstraction over Faker-backed generators.

Note: `helpers.*` is intentionally faker-only and not part of the domain abstraction.

Most common Faker usage is mapped to domain methods so schemas can use a curated, stable surface.

Each domain page lists methods, arguments, and executable examples.

## Quick Examples

```txt
FirstName
person.firstName()
LastName
person.lastName()
Email
internet.email()
Address
location.streetAddress()
```

```txt
Direction
location.cardinalDirection(abbreviated=true)
```

```txt
Date
date.between(from=1577836800000, to=1659312000000)
```

```txt
IBAN
finance.iban(formatted=true, countryCode="GB")
IBANDE
finance.iban(formatted=false, countryCode="DE")
```

```txt
Num
number.int(min=32, max=47)
```

For faker helper templates and utility functions, use faker helpers:
- [Faker Helpers](/docs/test-data/faker/helpers)
- [fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

## Domains

- [airline](/docs/test-data/domain/airline)
- [animal](/docs/test-data/domain/animal)
- [book](/docs/test-data/domain/book)
- [color](/docs/test-data/domain/color)
- [commerce](/docs/test-data/domain/commerce)
- [company](/docs/test-data/domain/company)
- [database](/docs/test-data/domain/database)
- [datatype](/docs/test-data/domain/datatype)
- [date](/docs/test-data/domain/date)
- [finance](/docs/test-data/domain/finance)
- [food](/docs/test-data/domain/food)
- [git](/docs/test-data/domain/git)
- [hacker](/docs/test-data/domain/hacker)
- [image](/docs/test-data/domain/image)
- [internet](/docs/test-data/domain/internet)
- [literal](/docs/test-data/domain/literal)
- [location](/docs/test-data/domain/location)
- [lorem](/docs/test-data/domain/lorem)
- [music](/docs/test-data/domain/music)
- [number](/docs/test-data/domain/number)
- [person](/docs/test-data/domain/person)
- [phone](/docs/test-data/domain/phone)
- [science](/docs/test-data/domain/science)
- [string](/docs/test-data/domain/string)
- [system](/docs/test-data/domain/system)
- [vehicle](/docs/test-data/domain/vehicle)
- [word](/docs/test-data/domain/word)