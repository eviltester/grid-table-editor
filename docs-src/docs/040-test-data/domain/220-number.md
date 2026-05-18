---
sidebar_position: 220
title: "number Domain"
description: "Domain keyword reference for number."
---

# number Domain

The `number` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

## Methods

### `number.bigInt`

Returns a BigInt number.

- Canonical: `awd.domain.number.bigInt`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string|number|boolean` | no | No description provided. |

Examples:

```txt
number.bigInt()
```

```txt
number.bigInt(value="sample")
```

### `number.binary`

Returns a binary string.

- Canonical: `awd.domain.number.binary`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `max` | `number` | no | Upper bound for generated number. |
| `min` | `number` | no | Lower bound for generated number. |

Examples:

```txt
number.binary()
```

```txt
number.binary(max=1)
```

Example return values:
- `"1"`
- `"1"`

### `number.float`

Returns a single random floating-point number, by default between `0.0` and `1.0`. To change the range, pass a `min` and `max` value. To limit the number of decimal places, pass a `multipleOf` or `fractionDigits` parameter.

- Canonical: `awd.domain.number.float`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `number` | no | No description provided. |
| `fractionDigits` | `number` | no | The maximum number of digits to appear after the decimal point, for example 2 will round to 2 decimal points. Only one of multipleOf or fractionDigits should be passed. |
| `max` | `number` | no | Upper bound for generated number, exclusive, unless multipleOf or fractionDigits are passed. |
| `min` | `number` | no | Lower bound for generated number, inclusive. |
| `multipleOf` | `number` | no | The generated number will be a multiple of this parameter. Only one of multipleOf or fractionDigits should be passed. |

Examples:

```txt
number.float()
```

```txt
number.float(value=1)
```

Example return values:
- `0.7629624890759333`
- `0.9828307141721478`

### `number.hex`

Returns a lowercase hexadecimal number.

- Canonical: `awd.domain.number.hex`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `value` | `number` | no | No description provided. |

Examples:

```txt
number.hex()
```

```txt
number.hex(min=1)
```

Example return values:
- `"d"`
- `"5"`

### `number.int`

Returns a single random integer between zero and the given max value or the given range.

- Canonical: `awd.domain.number.int`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Optional minimum integer. |
| `max` | `number` | no | Optional maximum integer. |
| `multipleOf` | `number` | no | Generated number will be a multiple of the given integer. |

Examples:

```txt
number.int()
```

```txt
number.int(min=1)
```

Example return values:
- `1756010253098632`
- `8303191971665533`

### `number.octal`

Returns an octal string.

- Canonical: `awd.domain.number.octal`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `max` | `number` | no | Upper bound for generated number. |
| `min` | `number` | no | Lower bound for generated number. |

Examples:

```txt
number.octal()
```

```txt
number.octal(max=1)
```

Example return values:
- `"6"`
- `"6"`

### `number.romanNumeral`

Returns a roman numeral in String format.

- Canonical: `awd.domain.number.romanNumeral`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `value` | `number` | no | No description provided. |

Examples:

```txt
number.romanNumeral()
```

```txt
number.romanNumeral(min=1)
```

Example return values:
- `"MDLXV"`
- `"MMMCCXXI"`
