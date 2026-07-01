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
| `min` | `bigint\|number\|string\|boolean` | no | Optional minimum bound for the generated BigInt value. |
| `max` | `bigint\|number\|string\|boolean` | no | Optional maximum bound for the generated BigInt value. |
| `multipleOf` | `bigint\|number\|string\|boolean` | no | Generated BigInt will be a multiple of the given value. |

Examples:

Shows number.bigInt with all optional params omitted.

```txt
number.bigInt()
```

Returns: `703101335462806n`

Shows number.bigInt using min and max bounds.

```txt
number.bigInt(min=100, max=1000)
```

Returns: `570n`

Shows number.bigInt constrained to a multiple.

```txt
number.bigInt(multipleOf=7)
```

Returns: `292170934823957n`

Shows number.bigInt using an upper bound.

```txt
number.bigInt(max=1000)
```

Returns: `699n`

### `number.binary`

Returns a binary string.

- Canonical: `awd.domain.number.binary`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `max` | `number` | no | Upper bound for generated number. |
| `min` | `number` | no | Lower bound for generated number. |

Examples:

Shows number.binary when optional params are omitted.

```txt
number.binary()
```

Returns: `0`

Shows number.binary using max.

```txt
number.binary(max=5)
```

Returns: `10`

Shows number.binary using min.

```txt
number.binary(max=10, min=1)
```

Returns: `101`

### `number.float`

Returns a single random floating-point number, by default between `0.0` and `1.0`. To change the range, pass a `min` and `max` value. To limit the number of decimal places, pass a `multipleOf` or `fractionDigits` parameter.

- Canonical: `awd.domain.number.float`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `fractionDigits` | `integer` | no | The maximum number of digits to appear after the decimal point, for example 2 will round to 2 decimal points. Only one of multipleOf or fractionDigits should be passed. |
| `max` | `number` | no | Upper bound for generated number, exclusive, unless multipleOf or fractionDigits are passed. |
| `min` | `number` | no | Lower bound for generated number, inclusive. |
| `multipleOf` | `number` | no | The generated number will be a multiple of this parameter. Only one of multipleOf or fractionDigits should be passed. |

Examples:

Shows number.float with all optional params omitted.

```txt
number.float()
```

Returns: `0.417022004702574`

Shows number.float rounding using only fractionDigits.

```txt
number.float(fractionDigits=2)
```

Returns: `0.42`

Shows number.float constrained using only multipleOf.

```txt
number.float(multipleOf=0.5)
```

Returns: `0.5`

Shows number.float with an explicit numeric range.

```txt
number.float(min=1, max=10)
```

Returns: `4.753198042323167`

Shows number.float rounding with fractionDigits.

```txt
number.float(min=1, max=10, fractionDigits=2)
```

Returns: `4.75`

Shows number.float constrained to a multiple.

```txt
number.float(min=1, max=10, multipleOf=0.5)
```

Returns: `4.5`

Shows number.float using only an upper bound.

```txt
number.float(max=10)
```

Returns: `4.17022004702574`

### `number.hex`

Returns a lowercase hexadecimal number.

- Canonical: `awd.domain.number.hex`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |

Examples:

Shows number.hex when optional params are omitted.

```txt
number.hex()
```

Returns: `6`

Shows number.hex using min.

```txt
number.hex(max=10, min=1)
```

Returns: `5`

Shows number.hex using max.

```txt
number.hex(max=5)
```

Returns: `2`

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

Shows number.int when optional params are omitted.

```txt
number.int()
```

Returns: `3756200289967619`

Shows number.int using min.

```txt
number.int(max=10, min=1)
```

Returns: `5`

Shows number.int using max.

```txt
number.int(max=5)
```

Returns: `2`

Shows number.int using multipleOf.

```txt
number.int(multipleOf=1)
```

Returns: `3756200289967619`

### `number.octal`

Returns an octal string.

- Canonical: `awd.domain.number.octal`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `max` | `number` | no | Upper bound for generated number. |
| `min` | `number` | no | Lower bound for generated number. |

Examples:

Shows number.octal when optional params are omitted.

```txt
number.octal()
```

Returns: `3`

Shows number.octal using max.

```txt
number.octal(max=5)
```

Returns: `2`

Shows number.octal using min.

```txt
number.octal(max=10, min=1)
```

Returns: `5`

### `number.romanNumeral`

Returns a roman numeral in String format.

- Canonical: `awd.domain.number.romanNumeral`
- Faker docs: [https://fakerjs.dev/api/number](https://fakerjs.dev/api/number)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |

Examples:

Shows number.romanNumeral when optional params are omitted.

```txt
number.romanNumeral()
```

Returns: `MDCLXVIII`

Shows number.romanNumeral using min.

```txt
number.romanNumeral(max=10, min=1)
```

Returns: `V`

Shows number.romanNumeral using max.

```txt
number.romanNumeral(max=5)
```

Returns: `III`
