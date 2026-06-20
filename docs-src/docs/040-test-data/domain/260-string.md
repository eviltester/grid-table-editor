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
| `casing` | `upper\|lower\|mixed` | no | The casing of the characters. |
| `exclude` | `array` | no | An array with characters which should be excluded in the generated string. |

Examples:

Shows string.alpha with all optional params omitted.

```txt
string.alpha()
```

Returns: `v`

Shows string.alpha generating a fixed-length alphabetic value.

```txt
string.alpha(length=5)
```

Returns: `vLaph`

Shows string.alpha using only the casing option.

```txt
string.alpha(casing="upper")
```

Returns: `K`

Shows string.alpha with explicit uppercase output.

```txt
string.alpha(length=5, casing="upper")
```

Returns: `KSAHD`

Shows string.alpha excluding specific characters without setting length or casing.

```txt
string.alpha(exclude=["A","B","C"])
```

Returns: `u`

Shows string.alpha excluding specific characters from the candidate set.

```txt
string.alpha(length=5, casing="upper", exclude=["A","B","C"])
```

Returns: `MTDJG`

### `string.alphanumeric`

Generating a string consisting of alpha characters and digits.

- Canonical: `awd.domain.string.alphanumeric`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `casing` | `upper\|lower\|mixed` | no | The casing of the characters. |
| `exclude` | `array` | no | An array of characters and digits which should be excluded in the generated string. |

Examples:

Shows string.alphanumeric when optional params are omitted.

```txt
string.alphanumeric()
```

Returns: `p`

Shows string.alphanumeric using length.

```txt
string.alphanumeric(length=5)
```

Returns: `pI0i9`

Shows string.alphanumeric using casing.

```txt
string.alphanumeric(casing="upper")
```

Returns: `F`

Shows string.alphanumeric using exclude.

```txt
string.alphanumeric(exclude=["A","B","C"])
```

Returns: `o`

### `string.binary`

Returns a binary string.

- Canonical: `awd.domain.string.binary`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. |
| `prefix` | `string` | no | Prefix for the generated number. |

Examples:

Shows string.binary when optional params are omitted.

```txt
string.binary()
```

Returns: `0b0`

Shows string.binary using length.

```txt
string.binary(length=5)
```

Returns: `0b01000`

Shows string.binary using prefix.

```txt
string.binary(prefix="PRE-")
```

Returns: `PRE-0`

### `string.counterString`

Generates a counterstring for a random length between min and max (or fixed length when only one value is provided). Defaults to min=1 and max=25 when omitted.

- Canonical: `awd.domain.string.counterString`

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `integer` | no | Minimum counterstring length (integer). If max is omitted and min is provided, min is also used as max. Defaults to 1 when omitted. Non-integer values throw an exception. |
| `max` | `integer` | no | Maximum counterstring length (integer). If less than min, values are swapped. Defaults to 25 when omitted. Non-integer values throw an exception. |
| `delimiter` | `string` | no | Delimiter character used between position markers. Defaults to "*". |

Examples:

Shows string.counterString default from 1 to 25 chars.

```txt
string.counterString()
```

Returns: `*3*5*7*10*13*`

Shows string.counterString with a fixed length of 15 chars.

```txt
string.counterString(min=15)
```

Returns: `*3*5*7*9*12*15*`

Shows string.counterString with a length between 5 and 12 chars.

```txt
string.counterString(min=5, max=12)
```

Returns: `*3*5*7*9*`

Shows string.counterString with a fixed length of 12 chars and a custom delimiter.

```txt
string.counterString(min=12, max=12, delimiter="#")
```

Returns: `#3#5#7#9#12#`

Shows string.counterString with a length between 1 and 10 chars.

```txt
string.counterString(max=10, min=1)
```

Returns: `2*4*6*`

Shows string.counterString with a length between 1 and 12 chars.

```txt
string.counterString(max=12)
```

Returns: `*3*5*7*`

Shows string.counterString using a custom delimiter and a length between 1 and 25 chars.

```txt
string.counterString(delimiter="#")
```

Returns: `#3#5#7#10#13#`

### `string.fromCharacters`

Generates a string from the given characters.

- Canonical: `awd.domain.string.fromCharacters`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `characters` | `string\|array` | yes | Character set (string or array) used when generating output. |
| `length` | `integer` | no | Desired length of the generated value. |

Examples:

Shows string.fromCharacters with only the required characters argument.

```txt
string.fromCharacters(characters="ABC123")
```

Returns: `C`

Shows string.fromCharacters in use.

```txt
string.fromCharacters(characters=["A", "B", "C"], length=4)
```

Returns: `BCAA`

Shows string.fromCharacters using length.

```txt
string.fromCharacters(characters="ABC123", length=4)
```

Returns: `C2AB`

### `string.hexadecimal`

Returns a hexadecimal string.

- Canonical: `awd.domain.string.hexadecimal`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `casing` | `upper\|lower\|mixed` | no | Casing of the generated number. |
| `length` | `number` | no | The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. |
| `prefix` | `string` | no | Prefix for the generated number. |

Examples:

Shows string.hexadecimal when optional params are omitted.

```txt
string.hexadecimal()
```

Returns: `0x9`

Shows string.hexadecimal using casing.

```txt
string.hexadecimal(casing="upper")
```

Returns: `0x9`

Shows string.hexadecimal using length.

```txt
string.hexadecimal(length=5)
```

Returns: `0x9f063`

Shows string.hexadecimal using prefix.

```txt
string.hexadecimal(prefix="PRE-")
```

Returns: `PRE-9`

### `string.nanoid`

Generates a Nano ID.

- Canonical: `awd.domain.string.nanoid`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact number of characters to generate. |

Examples:

Shows string.nanoid when optional params are omitted.

```txt
string.nanoid()
```

Returns: `Ii5lxGSFycYGT2SqxjPK-`

Shows string.nanoid using length.

```txt
string.nanoid(length=5)
```

Returns: `Ii5lx`

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

Shows string.numeric when optional params are omitted.

```txt
string.numeric()
```

Returns: `4`

Shows string.numeric using length.

```txt
string.numeric(length=5)
```

Returns: `47031`

Shows string.numeric using allowLeadingZeros.

```txt
string.numeric(allowLeadingZeros=true)
```

Returns: `4`

Shows string.numeric using exclude.

```txt
string.numeric(exclude=["A","B","C"])
```

Returns: `4`

### `string.octal`

Returns an octal string.

- Canonical: `awd.domain.string.octal`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. |
| `prefix` | `string` | no | Prefix for the generated number. |

Examples:

Shows string.octal when optional params are omitted.

```txt
string.octal()
```

Returns: `0o3`

Shows string.octal using length.

```txt
string.octal(length=5)
```

Returns: `0o35021`

Shows string.octal using prefix.

```txt
string.octal(prefix="PRE-")
```

Returns: `PRE-3`

### `string.sample`

Returns a string containing UTF-16 chars between 33 and 125 (`!` to `&#125;`).

- Canonical: `awd.domain.string.sample`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact number of characters to generate. |

Examples:

Shows string.sample when optional params are omitted.

```txt
string.sample()
```

Returns: `Gc!=.)2AES`

Shows string.sample using length.

```txt
string.sample(length=5)
```

Returns: `Gc!=.`

### `string.symbol`

Returns a string containing only ASCII symbol characters such as !, ", #, $, %, &amp;, (, ), *, +, -, /, :, ;, &lt;, =, &gt;, ?, @, [, \, ], ^, _, `, &#123;, |, &#125;, and ~.

- Canonical: `awd.domain.string.symbol`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact number of characters to generate. |

Examples:

Shows string.symbol when optional params are omitted.

```txt
string.symbol()
```

Returns: `.`

Shows string.symbol using length.

```txt
string.symbol(length=5)
```

Returns: `.\!*%`

### `string.ulid`

Returns a ULID (Universally Unique Lexicographically Sortable Identifier).

- Canonical: `awd.domain.string.ulid`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `number` | no | The date to use as reference point for the newly generated ULID encoded timestamp. The encoded timestamp is represented by the first 10 characters of the result. |

Examples:

Shows string.ulid when optional params are omitted.

```txt
string.ulid()
```

Returns: `01KVDQ3AJ0DQ09425BCHDN6W0N`

Shows string.ulid using refDate.

```txt
string.ulid(refDate=1718755200000)
```

Returns: `01J0PWP300DQ09425BCHDN6W0N`

### `string.uuid`

Returns a UUID (Universally Unique Identifier).

- Canonical: `awd.domain.string.uuid`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `version` | `4\|7` | no | The specific UUID version to use. If refDate is supplied and version is omitted, version 7 is used automatically. |
| `refDate` | `string\|number\|date` | no | The timestamp to encode into the UUID. This is only valid for UUID v7. If refDate is supplied and version is omitted, version 7 is used automatically. Providing refDate with version 4 is invalid. |

Examples:

Shows string.uuid when optional params are omitted.

```txt
string.uuid()
```

Returns: `6b042125-686a-43e0-8a68-23cf5bee102e`

Shows string.uuid using version.

```txt
string.uuid(version=7)
```

Returns: `019edb71-aa40-76b0-8421-25686a3e0a68`

Shows string.uuid using refDate.

```txt
string.uuid(refDate="2026-06-18T00:00:00.000Z")
```

Returns: `019ed807-0800-76b0-8421-25686a3e0a68`
