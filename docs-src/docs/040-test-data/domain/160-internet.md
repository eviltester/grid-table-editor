---
sidebar_position: 160
title: "internet Domain"
description: "Domain keyword reference for internet."
---

# internet Domain

The `internet` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

## Methods

### `internet.color`

Generates a random css hex color code in aesthetically pleasing color palette.

- Canonical: `awd.domain.internet.color`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.color()
```

Example return values:
- `"#2d5c7d"`
- `"#604136"`

### `internet.displayName`

Generates a display name using the given person's name as base.

- Canonical: `awd.domain.internet.displayName`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.displayName()
```

Example return values:
- `"Donna_Willms14"`
- `"Glenna70"`

### `internet.domainName`

Generates a random domain name.

- Canonical: `awd.domain.internet.domainName`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.domainName()
```

Example return values:
- `"carefree-kiss.net"`
- `"monumental-independence.net"`

### `internet.domainSuffix`

Returns a random domain suffix.

- Canonical: `awd.domain.internet.domainSuffix`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.domainSuffix()
```

Example return values:
- `"name"`
- `"org"`

### `internet.domainWord`

Generates a random domain word.

- Canonical: `awd.domain.internet.domainWord`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.domainWord()
```

Example return values:
- `"wry-outset"`
- `"oily-paintwork"`

### `internet.email`

Generates data using faker internet email.

- Canonical: `awd.domain.internet.email`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `allowSpecialCharacters` | `boolean` | no | Whether special characters such as .!#$%&'*+-/=?^_`&#123;\|&#125;~ should be included in the email address. |
| `firstName` | `string` | no | The optional first name to use. |
| `lastName` | `string` | no | The optional last name to use. |
| `provider` | `string` | no | The mail provider domain to use. If not specified, a random free mail provider will be chosen. |

Examples:

```txt
internet.email()
```

```txt
internet.email(allowSpecialCharacters=true, firstName="sample", lastName="sample", provider="sample")
```

Example return values:
- `"Mayra65@gmail.com"`
- `"Antone_Kub87@hotmail.com"`

### `internet.emoji`

Generates a random emoji.

- Canonical: `awd.domain.internet.emoji`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `types` | `array` | no | A list of the emoji types that should be used. |

Examples:

```txt
internet.emoji()
```

```txt
internet.emoji(types=["food","nature"])
```

Example return values:
- `"🥑"`
- `"👜"`

### `internet.exampleEmail`

Generates data using faker internet example email.

- Canonical: `awd.domain.internet.exampleEmail`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.exampleEmail()
```

Example return values:
- `"Spencer_Mante@example.com"`
- `"Madison.Kub29@example.org"`

### `internet.httpMethod`

Returns a random http method.

- Canonical: `awd.domain.internet.httpMethod`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.httpMethod()
```

Example return values:
- `"PUT"`
- `"DELETE"`

### `internet.httpStatusCode`

Generates a random HTTP status code.

- Canonical: `awd.domain.internet.httpStatusCode`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.httpStatusCode()
```

Example return values:
- `505`
- `506`

### `internet.ip`

Generates a random IPv4 or IPv6 address.

- Canonical: `awd.domain.internet.ip`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.ip()
```

Example return values:
- `"8eb3:eb0b:23f8:24af:dab0:32ff:b9e8:dfcb"`
- `"224.35.99.161"`

### `internet.ipv4`

Generates a random IPv4 address.

- Canonical: `awd.domain.internet.ipv4`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `cidrBlock` | `string` | no | The optional CIDR block to use. Must be in the format x.x.x.x/y. |
| `network` | `string` | no | The optional network to use. This is intended as an alias for well-known cidrBlocks. |

Examples:

```txt
internet.ipv4()
```

```txt
internet.ipv4(cidrBlock="192.168.0.0/24", network="private-a")
```

Example return values:
- `"66.234.157.133"`
- `"87.85.6.113"`

### `internet.ipv6`

Generates a random IPv6 address.

- Canonical: `awd.domain.internet.ipv6`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.ipv6()
```

Example return values:
- `"efab:dbdb:dbc0:f3ed:4fc0:be73:ec76:08ac"`
- `"8ccb:adb2:6eb1:eb7e:e6eb:bc3c:cd92:a021"`

### `internet.jwt`

Generates a random JWT (JSON Web Token).

- Canonical: `awd.domain.internet.jwt`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `header` | `array` | no | The header to use for the token. If present, it will replace any default values. |
| `payload` | `array` | no | The payload to use for the token. If present, it will replace any default values. |
| `refDate` | `number` | no | The date to use as reference point for the newly generated date. |

Examples:

```txt
internet.jwt()
```

```txt
internet.jwt(header=["sample"], payload=["sample"], refDate=1)
```

Example return values:
- `"eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzkxMDUxODQsImV4cCI6MTc3OTExNjI0MCwibmJmIjoxNzU2MzczMzM2LCJpc3MiOiJIdWRzb24gSW5jIiwic3ViIjoiZDE3MTJkYzQtYjZlZi00MTA2LWIxYzUtNjlmNDJiNjljMjZjIiwiYXVkIjoiYzdlNjliODYtOWE4OS00MDZmLTgzYWItMDkzYzQ5MWNmZjQyIiwianRpIjoiMDI0NjNhNGUtMWNhNy00MGE2LWI1ZDktZGJjNTYyZWNjNDFiIn0.Gs8gUfYlSgDoJOaDI2NoNEfyMG0UUL88TkJApQkhFjIBD66avEjmn0BWxPHOq3Ub"`
- `"eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzkwMjE1NDUsImV4cCI6MTc3OTA2MzMzMCwibmJmIjoxNzQ4Mjg4OTI2LCJpc3MiOiJWYW5kZXJ2b3J0LCBSb2JlbCBhbmQgQWx0ZW53ZXJ0aCIsInN1YiI6ImJkODUwNTg1LTI1YTAtNDAwOC04OWEzLTcwMDgyNGE2YjY5ZiIsImF1ZCI6IjhhYThhYzM0LWM1ZDgtNDdiZi1iMjVkLWE1MzI5NjVmMjdjNyIsImp0aSI6IjRlMjE3MDllLTg4ZGUtNDk1Ny04MzZmLTJiMTY3ODkzNDExZiJ9.o2Mmjn9y3Mfcj6N2LgWJGmv3fAbn2UyEbxIAeo1NyufQFwJA0UgzQ0e52Dv38mjo"`

### `internet.jwtAlgorithm`

Generates a random JWT (JSON Web Token) Algorithm.

- Canonical: `awd.domain.internet.jwtAlgorithm`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.jwtAlgorithm()
```

Example return values:
- `"HS384"`
- `"HS384"`

### `internet.mac`

Generates a random mac address.

- Canonical: `awd.domain.internet.mac`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `separator` | `string` | no | The optional separator to use. Can be either ':', '-' or ''. |

Examples:

```txt
internet.mac()
```

```txt
internet.mac(separator="-")
```

Example return values:
- `"9d:65:b8:77:9e:e2"`
- `"9e:d7:be:f2:62:0e"`

### `internet.password`

Generates a random password-like string. Do not use this method for generating actual passwords for users.

- Canonical: `awd.domain.internet.password`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | The length of the password to generate. |
| `memorable` | `boolean` | no | Whether the generated password should be memorable. |
| `pattern` | `string` | no | The pattern that all chars should match. This option will be ignored, if memorable is true. |
| `prefix` | `string` | no | The prefix to use. |

Examples:

```txt
internet.password()
```

```txt
internet.password(length=1, memorable=true, pattern="sample", prefix="#")
```

Example return values:
- `"7FRCloUvbQ8D4zB"`
- `"J89o3mPBaw0mEv9"`

### `internet.port`

Generates a random port number.

- Canonical: `awd.domain.internet.port`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.port()
```

Example return values:
- `29644`
- `51998`

### `internet.protocol`

Returns a random web protocol. Either `http` or `https`.

- Canonical: `awd.domain.internet.protocol`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.protocol()
```

Example return values:
- `"https"`
- `"https"`

### `internet.url`

Generates a random http(s) url.

- Canonical: `awd.domain.internet.url`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `appendSlash` | `boolean` | no | Whether to append a slash to the end of the url (path). |
| `protocol` | `string` | no | The protocol to use. |

Examples:

```txt
internet.url()
```

```txt
internet.url(appendSlash=true, protocol="sample")
```

Example return values:
- `"https://twin-newsletter.info"`
- `"https://productive-conservation.org/"`

### `internet.userAgent`

Generates a random user agent string.

- Canonical: `awd.domain.internet.userAgent`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.userAgent()
```

Example return values:
- `"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/556.49.37 (KHTML, like Gecko) Version/16.1 Safari/584.80.32"`
- `"FakerBot/8.17.16"`

### `internet.username`

Generates a username using the given person's name as base.

- Canonical: `awd.domain.internet.username`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `firstName` | `string` | no | The optional first name to use. |
| `lastName` | `string` | no | The optional last name to use. |

Examples:

```txt
internet.username()
```

```txt
internet.username(firstName="sample", lastName="sample")
```

Example return values:
- `"Myles_King"`
- `"Allie_Witting"`

### `internet.userName`

Generates a username using the given person's name as base.

- Canonical: `awd.domain.internet.userName`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.userName()
```

Example return values:
- `"Alba90"`
- `"Keith3"`
