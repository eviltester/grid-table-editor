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

## Unsafe Helper Variants

AnyWayData accepts literal helper arguments by default. Literal arguments include strings, numbers, booleans, `null`, arrays, and plain objects that contain only literal values.

Some Faker helper variants accept JavaScript expressions such as callback functions. These are **unsafe** because they execute expression-style schema text. Only enable them for schemas you trust.

| Helper command | Safe by default | Unsafe variant |
| --- | --- | --- |
| `helpers.mustache` | `helpers.mustache("Hello {{name}}", { name: "Ada" })` | `helpers.mustache("Hello {{name}}", { name: () => this.person.firstName() })` |
| `helpers.maybe` | not available in safe mode because its first argument is a callback | `helpers.maybe(() => "enabled", { probability: 1 })` |
| `helpers.multiple` | not available in safe mode because its first argument is a callback | `helpers.multiple(() => this.person.firstName(), { count: 3 })` |
| `helpers.uniqueArray` | `helpers.uniqueArray(["red", "green", "blue"], 2)` | `helpers.uniqueArray(() => this.person.firstName(), 5)` |

Opt in only when the schema source is trusted:

- Web UI: open the **Generation settings** cog in the Test Data toolbar and enable `allow unsafe faker`.
- CLI: add `--unsafe-faker-expressions`.
- REST API: send `unsafeFakerExpressions: true` in the `/v1/generate` or `/v1/generate/amend` JSON body, or use `?unsafeFakerExpressions=true` with `/v1/generate/fromschema`.
- MCP: pass `unsafeFakerExpressions: true` in the `generate_data_from_spec` or `amend_data_from_spec` tool arguments.

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
helpers.uniqueArray(["red", "green", "blue"], 2)
```

The callback form `helpers.uniqueArray(() => this.word.sample(), 5)` is an unsafe variant and requires the unsafe faker opt-in.

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
- Some Faker helper callback shapes require the unsafe faker opt-in. Use literal helper arguments unless you explicitly trust the schema source.

## Faker Reference

- [Faker Helpers API](https://fakerjs.dev/api/helpers)
