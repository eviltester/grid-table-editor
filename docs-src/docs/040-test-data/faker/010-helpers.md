---
sidebar_position: 1
title: "Faker Helpers"
description: "Using faker.helpers.* commands in AnyWayData."
---

# Faker Helpers

`helpers.*` commands are supported in the faker path and are intentionally excluded from the domain abstraction.

Use:

```txt
helpers.arrayElement(["red", "green", "blue"])
```

or:

```txt
faker.helpers.arrayElement(["red", "green", "blue"])
```

Do not use:

```txt
domain.helpers.arrayElement(["red", "green", "blue"])
```

That form is invalid and will fail with `helpers_not_supported_in_domain`.

## Common Helper Examples

```txt
helpers.fake("Hi, my name is {{person.firstName}} {{person.lastName}}!")
```

```txt
helpers.mustache("I found {{count}} items.", { count: () => `${this.number.int()}` })
```

```txt
helpers.fromRegExp("[A-Z]{2}[0-9]{3}")
```

## Notes

- Many helper functions can return arrays or objects depending on method and inputs.
- Prefer scalar-returning helpers when using grid/display flows that expect single values.

## Faker Reference

- [Faker Helpers API](https://fakerjs.dev/api/helpers)
