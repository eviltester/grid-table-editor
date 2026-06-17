---
sidebar_position: 260
title: "string Domain"
description: "Domain keyword reference for string."
---

# string Domain

The `string` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

## Methods

### `string.alpha`

Generating a string consisting of letters in the English alphabet.

- Canonical: `awd.domain.string.alpha`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `casing` | `string` | no | The casing of the characters. |
| `exclude` | `array` | no | An array with characters which should be excluded in the generated string. |

Examples:

```txt
string.alpha()
```

```txt
string.alpha(length=1, casing="lower", exclude=["item"])
```

Example return values:
- `R`

### `string.alphanumeric`

Generating a string consisting of alpha characters and digits.

- Canonical: `awd.domain.string.alphanumeric`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `casing` | `string` | no | The casing of the characters. |
| `exclude` | `array` | no | An array of characters and digits which should be excluded in the generated string. |

Examples:

```txt
string.alphanumeric()
```

```txt
string.alphanumeric(length=1, casing="lower", exclude=["item"])
```

Example return values:
- `s`

### `string.binary`

Returns a binary string.

- Canonical: `awd.domain.string.binary`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. |
| `prefix` | `string` | no | Prefix for the generated number. |

Examples:

```txt
string.binary()
```

```txt
string.binary(length=1, prefix="#")
```

Example return values:
- `0b0`

### `string.counterString`

Generates a counterstring for a random length between min and max (or fixed length when only one value is provided). Defaults to min=1 and max=25 when omitted.

- Canonical: `awd.domain.string.counterString`
- Docs: [/docs/test-data/counterstrings](/docs/test-data/counterstrings)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `integer` | no | Minimum counterstring length (integer). If max is omitted and min is provided, min is also used as max. Defaults to 1 when omitted. Non-integer values throw an exception. |
| `max` | `integer` | no | Maximum counterstring length (integer). If less than min, values are swapped. Defaults to 25 when omitted. Non-integer values throw an exception. |
| `delimiter` | `string` | no | Delimiter character used between position markers. Defaults to "*". |

Examples:

```txt
string.counterString()
```

```txt
string.counterString(15)
```

```txt
string.counterString(min=5, max=12)
```

```txt
string.counterString(min=12, max=12, delimiter="#")
```

Example return values:
- `*3*5*7*9*12*15*`
- `#3#5#7#9#12#`

### `string.fromCharacters`

Generates a string from the given characters.

- Canonical: `awd.domain.string.fromCharacters`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `characters` | `string\|array` | yes | Character set (string or array) used when generating output. |
| `length` | `integer` | no | Desired length of the generated value. |

Examples:

```txt
string.fromCharacters("ABC123", 6)
```

```txt
string.fromCharacters(characters=["A", "B", "C"], length=4)
```

Example return values:
- `A1B2`
- `CB2A`

### `string.hexadecimal`

Returns a hexadecimal string.

- Canonical: `awd.domain.string.hexadecimal`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `casing` | `string` | no | Casing of the generated number. |
| `length` | `number` | no | The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. |
| `prefix` | `string` | no | Prefix for the generated number. |

Examples:

```txt
string.hexadecimal()
```

```txt
string.hexadecimal(casing="lower", length=1, prefix="#")
```

Example return values:
- `0x1`

### `string.nanoid`

Generates a Nano ID.

- Canonical: `awd.domain.string.nanoid`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact number of characters to generate. |

Examples:

```txt
string.nanoid()
```

```txt
string.nanoid(length=1)
```

Example return values:
- `KLm49ferlh-eUmJpZdSIO`

### `string.numeric`

Generates a given length string of digits.

- Canonical: `awd.domain.string.numeric`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `allowLeadingZeros` | `boolean` | no | Whether leading zeros are allowed or not. |
| `exclude` | `array` | no | An array of digits which should be excluded in the generated string. |

Examples:

```txt
string.numeric()
```

```txt
string.numeric(length=1, allowLeadingZeros=true, exclude=["item"])
```

Example return values:
- `7`

### `string.octal`

Returns an octal string.

- Canonical: `awd.domain.string.octal`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. |
| `prefix` | `string` | no | Prefix for the generated number. |

Examples:

```txt
string.octal()
```

```txt
string.octal(length=1, prefix="#")
```

Example return values:
- `0o6`

### `string.sample`

Returns a string containing UTF-16 chars between 33 and 125 (`!` to `&#125;`).

- Canonical: `awd.domain.string.sample`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact number of characters to generate. |

Examples:

```txt
string.sample()
```

```txt
string.sample(length=1)
```

Example return values:
- `\Fw;0e:G.H`

### `string.symbol`

Returns a string containing only special characters from the following list:

- Canonical: `awd.domain.string.symbol`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact number of characters to generate. |

Examples:

```txt
string.symbol()
```

```txt
string.symbol(length=1)
```

Example return values:
- `.`

### `string.ulid`

Returns a ULID (Universally Unique Lexicographically Sortable Identifier).

- Canonical: `awd.domain.string.ulid`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `number` | no | The date to use as reference point for the newly generated ULID encoded timestamp. The encoded timestamp is represented by the first 10 characters of the result. |

Examples:

```txt
string.ulid()
```

```txt
string.ulid(refDate=1)
```

Example return values:
- `01KQADM2A0728G4D2HKCPWKS6N`

### `string.uuid`

Returns a UUID (Universally Unique Identifier).

- Canonical: `awd.domain.string.uuid`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `version` | `4\|7` | no | The specific UUID version to use. If `refDate` is supplied and `version` is omitted, version `7` is used automatically. |
| `refDate` | `string\|number\|date` | no | The timestamp to encode into the UUID. This is only valid for UUID v7. If `refDate` is supplied and `version` is omitted, version `7` is used automatically. Providing `refDate` with version `4` is invalid. |

Examples:

```txt
string.uuid()
```

```txt
string.uuid(refDate=1)
```

Example return values:
- `0628ae51-7b6c-4d33-9f24-dae19fb245df`
