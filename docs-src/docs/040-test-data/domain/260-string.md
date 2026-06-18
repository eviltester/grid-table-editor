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
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `casing` | `upper\|lower\|mixed` | no | The casing of the characters. |
| `exclude` | `array` | no | An array with characters which should be excluded in the generated string. |

Examples:

```txt
string.alpha()
```

```txt
string.alpha(length=5)
```

```txt
string.alpha(casing="upper")
```

```txt
string.alpha(length=5, casing="upper")
```

```txt
string.alpha(exclude=["A","B","C"])
```

```txt
string.alpha(length=5, casing="upper", exclude=["A","B","C"])
```

Example return values:
- `v`
- `vLaph`
- `K`
- `KSAHD`
- `u`
- `MTDJG`

### `string.alphanumeric`

Generating a string consisting of alpha characters and digits.

- Canonical: `awd.domain.string.alphanumeric`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `casing` | `upper\|lower\|mixed` | no | The casing of the characters. |
| `exclude` | `array` | no | An array of characters and digits which should be excluded in the generated string. |

Examples:

```txt
string.alphanumeric()
```

```txt
string.alphanumeric(length=5)
```

```txt
string.alphanumeric(casing="upper")
```

```txt
string.alphanumeric(exclude=["A","B","C"])
```

Example return values:
- `p`
- `pI0i9`
- `F`
- `o`

### `string.binary`

Returns a binary string.

- Canonical: `awd.domain.string.binary`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
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
string.binary(length=5)
```

```txt
string.binary(prefix="PRE-")
```

Example return values:
- `0b0`
- `0b01000`
- `PRE-0`

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
string.counterString(min=15)
```

```txt
string.counterString(min=5, max=12)
```

```txt
string.counterString(min=12, max=12, delimiter="#")
```

```txt
string.counterString(max=10, min=1)
```

```txt
string.counterString(max=12)
```

```txt
string.counterString(delimiter="#")
```

Example return values:
- `*3*5*7*10*13*`
- `*3*5*7*9*12*15*`
- `*3*5*7*9*`
- `#3#5#7#9#12#`
- `2*4*6*`
- `*3*5*7*`
- `#3#5#7#10#13#`

### `string.fromCharacters`

Generates a string from the given characters.

- Canonical: `awd.domain.string.fromCharacters`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `characters` | `string\|array` | yes | Character set (string or array) used when generating output. |
| `length` | `integer` | no | Desired length of the generated value. |

Examples:

```txt
string.fromCharacters(characters="ABC123", length=6)
```

```txt
string.fromCharacters(characters=["A", "B", "C"], length=4)
```

```txt
string.fromCharacters(characters="ABC123", length=4)
```

Example return values:
- `C2ABAA`
- `BCAA`
- `C2AB`

### `string.hexadecimal`

Returns a hexadecimal string.

- Canonical: `awd.domain.string.hexadecimal`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `casing` | `upper\|lower\|mixed` | no | Casing of the generated number. |
| `length` | `number` | no | The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. |
| `prefix` | `string` | no | Prefix for the generated number. |

Examples:

```txt
string.hexadecimal()
```

```txt
string.hexadecimal(casing="upper")
```

```txt
string.hexadecimal(length=5)
```

```txt
string.hexadecimal(prefix="PRE-")
```

Example return values:
- `0x9`
- `0x9`
- `0x9f063`
- `PRE-9`

### `string.nanoid`

Generates a Nano ID.

- Canonical: `awd.domain.string.nanoid`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact number of characters to generate. |

Examples:

```txt
string.nanoid()
```

```txt
string.nanoid(length=5)
```

Example return values:
- `Ii5lxGSFycYGT2SqxjPK-`
- `Ii5lx`

### `string.numeric`

Generates a given length string of digits.

- Canonical: `awd.domain.string.numeric`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
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
string.numeric(length=5)
```

```txt
string.numeric(allowLeadingZeros=true)
```

```txt
string.numeric(exclude=["A","B","C"])
```

Example return values:
- `4`
- `47031`
- `4`
- `4`

### `string.octal`

Returns an octal string.

- Canonical: `awd.domain.string.octal`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
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
string.octal(length=5)
```

```txt
string.octal(prefix="PRE-")
```

Example return values:
- `0o3`
- `0o35021`
- `PRE-3`

### `string.sample`

Returns a string containing UTF-16 chars between 33 and 125 (`!` to `&#125;`).

- Canonical: `awd.domain.string.sample`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact number of characters to generate. |

Examples:

```txt
string.sample()
```

```txt
string.sample(length=5)
```

Example return values:
- `Gc!=.)2AES`
- `Gc!=.`

### `string.symbol`

Returns a string containing only special characters from the following list:

- Canonical: `awd.domain.string.symbol`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact number of characters to generate. |

Examples:

```txt
string.symbol()
```

```txt
string.symbol(length=5)
```

Example return values:
- `.`
- `.\!*%`

### `string.ulid`

Returns a ULID (Universally Unique Lexicographically Sortable Identifier).

- Canonical: `awd.domain.string.ulid`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `number` | no | The date to use as reference point for the newly generated ULID encoded timestamp. The encoded timestamp is represented by the first 10 characters of the result. |

Examples:

```txt
string.ulid()
```

```txt
string.ulid(refDate=1718755200000)
```

Example return values:
- `01KVDQ3AJ0DQ09425BCHDN6W0N`
- `01J0PWP300DQ09425BCHDN6W0N`

### `string.uuid`

Returns a UUID (Universally Unique Identifier).

- Canonical: `awd.domain.string.uuid`
- Docs: [https://anywaydata.com/docs/test-data/domain/string](https://anywaydata.com/docs/test-data/domain/string)
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `version` | `4\|7` | no | The specific UUID version to use. If refDate is supplied and version is omitted, version 7 is used automatically. |
| `refDate` | `string\|number\|date` | no | The timestamp to encode into the UUID. This is only valid for UUID v7. If refDate is supplied and version is omitted, version 7 is used automatically. Providing refDate with version 4 is invalid. |

Examples:

```txt
string.uuid()
```

```txt
string.uuid(version=7)
```

```txt
string.uuid(refDate="2026-06-18T00:00:00.000Z")
```

Example return values:
- `6b042125-686a-43e0-8a68-23cf5bee102e`
- `019edb71-aa40-76b0-8421-25686a3e0a68`
- `019ed807-0800-76b0-8421-25686a3e0a68`
