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
- Docs: [https://anywaydata.com/docs/test-data/domain/number](https://anywaydata.com/docs/test-data/domain/number)
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `bigint\|number\|string\|boolean` | no | Base value used for generation. Supports bigint, number, string, or boolean inputs. For range constraints use min, max, and multipleOf. |

Examples:

```txt
number.bigInt()
```

```txt
number.bigInt(value=true)
```

Example return values:
- `703101335462806n`
- `703101335462806n`

### `number.binary`

Returns a binary string.

- Canonical: `awd.domain.number.binary`
- Docs: [https://anywaydata.com/docs/test-data/domain/number](https://anywaydata.com/docs/test-data/domain/number)
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
number.binary(max=5)
```

```txt
number.binary(max=10, min=1)
```

Example return values:
- `0`
- `10`
- `101`

### `number.float`

Returns a single random floating-point number, by default between `0.0` and `1.0`. To change the range, pass a `min` and `max` value. To limit the number of decimal places, pass a `multipleOf` or `fractionDigits` parameter.

- Canonical: `awd.domain.number.float`
- Docs: [https://anywaydata.com/docs/test-data/domain/number](https://anywaydata.com/docs/test-data/domain/number)
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `fractionDigits` | `integer` | no | The maximum number of digits to appear after the decimal point, for example 2 will round to 2 decimal points. Only one of multipleOf or fractionDigits should be passed. |
| `max` | `number` | no | Upper bound for generated number, exclusive, unless multipleOf or fractionDigits are passed. |
| `min` | `number` | no | Lower bound for generated number, inclusive. |
| `multipleOf` | `number` | no | The generated number will be a multiple of this parameter. Only one of multipleOf or fractionDigits should be passed. |

Examples:

```txt
number.float()
```

```txt
number.float(fractionDigits=2)
```

```txt
number.float(multipleOf=0.5)
```

```txt
number.float(min=1, max=10)
```

```txt
number.float(min=1, max=10, fractionDigits=2)
```

```txt
number.float(min=1, max=10, multipleOf=0.5)
```

```txt
number.float(max=10)
```

Example return values:
- `0.417022004702574`
- `0.42`
- `0.5`
- `4.753198042323167`
- `4.75`
- `4.5`
- `4.17022004702574`

### `number.hex`

Returns a lowercase hexadecimal number.

- Canonical: `awd.domain.number.hex`
- Docs: [https://anywaydata.com/docs/test-data/domain/number](https://anywaydata.com/docs/test-data/domain/number)
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
number.hex(max=10, min=1)
```

```txt
number.hex(max=5)
```

Example return values:
- `6`
- `5`
- `2`

### `number.int`

Returns a single random integer between zero and the given max value or the given range.

- Canonical: `awd.domain.number.int`
- Docs: [https://anywaydata.com/docs/test-data/domain/number](https://anywaydata.com/docs/test-data/domain/number)
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
number.int(max=10, min=1)
```

```txt
number.int(max=5)
```

```txt
number.int(multipleOf=1)
```

Example return values:
- `3756200289967619`
- `5`
- `2`
- `3756200289967619`

### `number.octal`

Returns an octal string.

- Canonical: `awd.domain.number.octal`
- Docs: [https://anywaydata.com/docs/test-data/domain/number](https://anywaydata.com/docs/test-data/domain/number)
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
number.octal(max=5)
```

```txt
number.octal(max=10, min=1)
```

Example return values:
- `3`
- `2`
- `5`

### `number.romanNumeral`

Returns a roman numeral in String format.

- Canonical: `awd.domain.number.romanNumeral`
- Docs: [https://anywaydata.com/docs/test-data/domain/number](https://anywaydata.com/docs/test-data/domain/number)
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
number.romanNumeral(max=10, min=1)
```

```txt
number.romanNumeral(max=5)
```

Example return values:
- `MDCLXVIII`
- `V`
- `III`
