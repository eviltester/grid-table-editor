---
sidebar_position: 250
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
string.alpha(length=5, casing="lower", exclude=["a"])
```

Example return values:
- `"S"`
- `"u"`

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
string.alphanumeric(length=5, casing="lower", exclude=["a", "1"])
```

Example return values:
- `"D"`
- `"K"`

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
- `"0b1"`

### `string.fromCharacters`

Generates a string from the given characters.

- Canonical: `awd.domain.string.fromCharacters`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `characters` | `string\|array` | yes | Character set (string or array) used when generating output. |
| `length` | `number` | no | Desired length of the generated value. |

Examples:

```txt
string.fromCharacters("sample")
```

```txt
string.fromCharacters(characters="abcdef", length=3)
```

Example return values:
- `"m"`
- `"l"`

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
- `"0xd"`
- `"0xB"`

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
string.nanoid(length=10)
```

Example return values:
- `"bt_JjqxXXh9GHz1MALPW2"`
- `"mjTRAlIjzdQ5Tg9rjv57R"`

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
string.numeric(length=5, allowLeadingZeros=true, exclude=["0"])
```

Example return values:
- `"4"`
- `"0"`

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
- `"0o1"`
- `"0o3"`

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
string.sample(length=10)
```

Example return values:
- `"R4A;9BcLzj"`
- `"X`ARt%ku=7"`

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
string.symbol(length=3)
```

Example return values:
- `"/"`
- `"_"`

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
- `"01KRXH5AE8V36069S9HB6G3CKY"`
- `"01KRXH5AE8FNGNXFP3JBW5NJXW"`

### `string.uuid`

Returns a UUID v4 (Universally Unique Identifier).

- Canonical: `awd.domain.string.uuid`
- Faker docs: [https://fakerjs.dev/api/string](https://fakerjs.dev/api/string)

No arguments.

Examples:

```txt
string.uuid()
```

Example return values:
- `"522928a9-04aa-4ec4-948a-5bbbfe882f64"`
- `"bd37a9cb-1f37-4d4a-aa6f-9681735bd00a"`
