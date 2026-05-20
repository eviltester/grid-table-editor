---
sidebar_position: 210
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
| `value` | `bigint\|number\|string\|boolean` | no | Base value used for generation. Supports bigint, number, string, or boolean inputs. For range constraints use min, max, and multipleOf. |

Examples:

```txt
number.bigInt()
```

```txt
number.bigInt(value="value")
```

Example return values:
- `347465151663036`

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
number.binary(max=1, min=1)
```

Example return values:
- `0`

### `number.float`

Returns a single random floating-point number, by default between `0.0` and `1.0`. To change the range, pass a `min` and `max` value. To limit the number of decimal places, pass a `multipleOf` or `fractionDigits` parameter.

- Canonical: `awd.domain.number.float`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `fractionDigits` | `number` | no | The maximum number of digits to appear after the decimal point, for example 2 will round to 2 decimal points. Only one of multipleOf or fractionDigits should be passed. |
| `max` | `number` | no | Upper bound for generated number, exclusive, unless multipleOf or fractionDigits are passed. |
| `min` | `number` | no | Lower bound for generated number, inclusive. |
| `multipleOf` | `number` | no | The generated number will be a multiple of this parameter. Only one of multipleOf or fractionDigits should be passed. |

Examples:

```txt
number.float()
```

Type-in examples (named params):

```txt
number.float(fractionDigits=1)
```

```txt
number.float(max=1)
```

```txt
number.float(min=1)
```

```txt
number.float(multipleOf=1)
```

Example return values:
- `0.5433707701438405`

### `number.hex`

Returns a lowercase hexadecimal number.

- Canonical: `awd.domain.number.hex`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |

Examples:

```txt
number.hex()
```

```txt
number.hex(min=1, max=1)
```

Example return values:
- `d`

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
number.int(min=1, max=1, multipleOf=1)
```

Example return values:
- `5190574431878510`

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
number.octal(max=1, min=1)
```

Example return values:
- `6`

### `number.romanNumeral`

Returns a roman numeral in String format.

- Canonical: `awd.domain.number.romanNumeral`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |

Examples:

```txt
number.romanNumeral()
```

```txt
number.romanNumeral(min=1, max=1)
```

Example return values:
- `XXXV`
