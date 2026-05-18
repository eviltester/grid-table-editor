---
sidebar_position: 150
title: "helpers Domain"
description: "Domain keyword reference for helpers."
---

# helpers Domain

The `helpers` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

## Methods

### `helpers.arrayElement`

Generates data using faker helpers array element.

- Canonical: `awd.domain.helpers.arrayElement`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

No parameters.

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`

### `helpers.arrayElements`

Generates data using faker helpers array elements.

- Canonical: `awd.domain.helpers.arrayElements`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

No parameters.

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`

### `helpers.enumValue`

Generate a value using faker helpers.enumValue.

- Canonical: `awd.domain.helpers.enumValue`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

No parameters.

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`

### `helpers.fake`

Generator for combining faker methods based on a static string input.

- Canonical: `awd.domain.helpers.fake`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `pattern` | `string` | yes | No description provided. |

Examples:

```txt
helpers.fake("sample")
```

```txt
helpers.fake(pattern="sample")
```

Example return values:
- `"sample"`
- `"sample"`

### `helpers.fromRegExp`

Generates a string matching the given regex like expressions.

- Canonical: `awd.domain.helpers.fromRegExp`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `pattern` | `string` | yes | No description provided. |

Examples:

```txt
helpers.fromRegExp("sample")
```

```txt
helpers.fromRegExp(pattern="sample")
```

Example return values:
- `"sample"`
- `"sample"`

### `helpers.maybe`

Generates data using faker helpers maybe.

- Canonical: `awd.domain.helpers.maybe`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `callback` | `string` | no | The callback to that will be invoked if the probability check was successful. |
| `probability` | `number` | no | The probability ([0.00, 1.00]) of the callback being invoked. |

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`

### `helpers.multiple`

Generates data using faker helpers multiple.

- Canonical: `awd.domain.helpers.multiple`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `method` | `number` | no | The method used to generate the values. The method will be called with (_, index), to allow using the index in the generated value e.g. as id. |
| `count` | `number` | no | The number or range of elements to generate. |

Examples:

```txt
helpers.multiple()
```

Example return values:
- `[null,null,null]`
- `[null,null,null]`

### `helpers.mustache`

Replaces the `{{placeholder}}` patterns in the given string mustache style.

- Canonical: `awd.domain.helpers.mustache`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | `string` | yes | No description provided. |
| `data` | `array` | no | The data used to populate the placeholders. This is a record where the key is the template placeholder, whereas the value is either a string or a function suitable for String.replace(). |

Examples:

```txt
helpers.mustache("sample")
```

```txt
helpers.mustache(text="sample")
```

Example return values:
- `"sample"`
- `"sample"`

### `helpers.objectEntry`

Generate a value using faker helpers.objectEntry.

- Canonical: `awd.domain.helpers.objectEntry`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

No parameters.

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`

### `helpers.objectKey`

Generate a value using faker helpers.objectKey.

- Canonical: `awd.domain.helpers.objectKey`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

No parameters.

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`

### `helpers.objectValue`

Generate a value using faker helpers.objectValue.

- Canonical: `awd.domain.helpers.objectValue`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

No parameters.

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`

### `helpers.rangeToNumber`

Helper method that converts the given number or range to a number.

- Canonical: `awd.domain.helpers.rangeToNumber`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `numberOrRange` | `number` | yes | No description provided. |

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`

### `helpers.replaceCreditCardSymbols`

Replaces the symbols and patterns in a credit card schema including Luhn checksum.

- Canonical: `awd.domain.helpers.replaceCreditCardSymbols`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `string` | `string` | no | No description provided. |
| `symbol` | `string` | no | No description provided. |

Examples:

```txt
helpers.replaceCreditCardSymbols()
```

```txt
helpers.replaceCreditCardSymbols(string="sample")
```

Example return values:
- `"6453-8952-4990-0228-7906"`
- `"6453-4321-7095-5598-4458"`

### `helpers.replaceSymbols`

Parses the given string symbol by symbols and replaces the placeholder appropriately.

- Canonical: `awd.domain.helpers.replaceSymbols`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `string` | `string` | no | No description provided. |

Examples:

```txt
helpers.replaceSymbols()
```

```txt
helpers.replaceSymbols(string="sample")
```

Example return values:
- `""`
- `""`

### `helpers.shuffle`

Generates data using faker helpers shuffle.

- Canonical: `awd.domain.helpers.shuffle`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `list` | `array` | no | The array to shuffle. |
| `inplace` | `boolean` | no | Whether to shuffle the array in place or return a new array. |

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`

### `helpers.slugify`

Slugifies the given string.

- Canonical: `awd.domain.helpers.slugify`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `string` | `string` | no | No description provided. |

Examples:

```txt
helpers.slugify()
```

```txt
helpers.slugify(string="sample")
```

Example return values:
- `""`
- `""`

### `helpers.uniqueArray`

Generates data using faker helpers unique array.

- Canonical: `awd.domain.helpers.uniqueArray`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

No parameters.

Examples:

```txt
helpers.uniqueArray()
```

Example return values:
- `[]`
- `[]`

### `helpers.weightedArrayElement`

Generates data using faker helpers weighted array element.

- Canonical: `awd.domain.helpers.weightedArrayElement`
- Faker docs: [https://fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)

No parameters.

Example:

Literal-only parser example is not currently available for this method.

Example return values:
- `Not available for this method with literal-only args.`
