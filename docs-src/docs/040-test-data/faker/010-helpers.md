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
helpers.mustache("Hello {{name}}", { name: "Ada" })
```

```txt
helpers.fromRegExp("[A-Z]{2}[0-9]{3}")
```

## Helper Methods

### `helpers.arrayElement`

```txt
helpers.arrayElement(["red", "green", "blue"])
```

### `helpers.arrayElements`

```txt
helpers.arrayElements(["red", "green", "blue"], { min: 1, max: 2 })
```

### `helpers.slugify`

```txt
helpers.slugify("Hello world from AnyWayData")
```

### `helpers.replaceSymbols`

```txt
helpers.replaceSymbols("Order-##??")
```

### `helpers.replaceCreditCardSymbols`

```txt
helpers.replaceCreditCardSymbols("####-####-####-####")
```

### `helpers.shuffle`

```txt
helpers.shuffle(["a", "b", "c"], { inplace: false })
```

### `helpers.uniqueArray`

```txt
helpers.uniqueArray(this.word.sample, 5)
```

### `helpers.weightedArrayElement`

```txt
helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 2, value: "rainy" }, { weight: 1, value: "snowy" }])
```

### `helpers.rangeToNumber`

```txt
helpers.rangeToNumber({ min: 1, max: 10 })
```

### `helpers.maybe`

```txt
helpers.maybe(() => "present", { probability: 0.8 }) ?? "fallback"
```

### `helpers.multiple`

```txt
helpers.multiple(() => this.person.firstName(), { count: 3 })
```

## Notes

- Many helper functions can return arrays or objects depending on method and inputs.
- Prefer scalar-returning helpers when using grid/display flows that expect single values.
- Some Faker helper callback shapes are not supported in browser schema text. Use the executable schema examples on this page when copying examples into AnyWayData.

## Faker Reference

- [Faker Helpers API](https://fakerjs.dev/api/helpers)
