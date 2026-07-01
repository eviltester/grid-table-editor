---
sidebar_position: 170
title: "internet Domain"
description: "Domain keyword reference for internet."
---

# internet Domain

The `internet` domain mostly maps domain keywords to faker-backed generators, but `internet.httpMethod` is implemented directly by AnywayData.

## Faker Documentation

- [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

## Methods

### `internet.displayName`

Generates a display name using the given person's name as base.

- Canonical: `awd.domain.internet.displayName`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `firstName` | `string` | no | Optional first name to use as the basis for the display name. |
| `lastName` | `string` | no | Optional last name to use as the basis for the display name. |

Examples:

Shows the default internet.displayName call.

```txt
internet.displayName()
```

Returns: `Aaliyah.Bosco`

Shows internet.displayName using firstName and lastName options.

```txt
internet.displayName(firstName="Ada", lastName="Lovelace")
```

Returns: `Ada72`

Shows internet.displayName using an explicit first name.

```txt
internet.displayName(firstName="Ada")
```

Returns: `Ada14`

Shows internet.displayName using an explicit last name.

```txt
internet.displayName(lastName="Lovelace")
```

Returns: `Aaliyah14`

### `internet.domainName`

Generates a random domain name.

- Canonical: `awd.domain.internet.domainName`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

Shows the default internet.domainName call.

```txt
internet.domainName
```

Returns: `inferior-punctuation.biz`

### `internet.domainSuffix`

Returns a random domain suffix.

- Canonical: `awd.domain.internet.domainSuffix`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

Shows the default internet.domainSuffix call.

```txt
internet.domainSuffix
```

Returns: `info`

### `internet.domainWord`

Generates a random domain word.

- Canonical: `awd.domain.internet.domainWord`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

Shows the default internet.domainWord call.

```txt
internet.domainWord
```

Returns: `inferior-punctuation`

### `internet.email`

Generates data using faker internet email.

- Canonical: `awd.domain.internet.email`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `allowSpecialCharacters` | `boolean` | no | Whether special characters such as .!#$%&amp;'*+-/=?^_`&#123;\|&#125;~ should be included in the email address. |
| `firstName` | `string` | no | The optional first name to use. |
| `lastName` | `string` | no | The optional last name to use. |
| `provider` | `string` | no | The mail provider domain to use. If not specified, a random free mail provider will be chosen. |

Examples:

Shows internet.email when optional params are omitted.

```txt
internet.email()
```

Returns: `Edwin.Dibbert@hotmail.com`

Shows internet.email using allowSpecialCharacters.

```txt
internet.email(allowSpecialCharacters=true)
```

Returns: `Edwin.Dibbert@hotmail.com`

Shows internet.email using firstName.

```txt
internet.email(firstName="Ada")
```

Returns: `Ada.Gutmann9@hotmail.com`

Shows internet.email using lastName.

```txt
internet.email(lastName="Lovelace")
```

Returns: `Edwin.Lovelace9@hotmail.com`

Shows internet.email using provider.

```txt
internet.email(provider="example.com")
```

Returns: `Aaliyah.Bosco@example.com`

### `internet.emoji`

Generates a random emoji.

- Canonical: `awd.domain.internet.emoji`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `types` | `array` | no | A list of the emoji types that should be used. |

Examples:

Shows internet.emoji when optional params are omitted.

```txt
internet.emoji()
```

Returns: `🥣`

Shows internet.emoji using types.

```txt
internet.emoji(types=["food"])
```

Returns: `🍲`

### `internet.exampleEmail`

Generates data using faker internet example email.

- Canonical: `awd.domain.internet.exampleEmail`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `firstName` | `string` | no | Optional first name to use as the basis for the email address. |
| `lastName` | `string` | no | Optional last name to use as the basis for the email address. |
| `allowSpecialCharacters` | `boolean` | no | Whether special characters are allowed in the generated email address. |

Examples:

Shows the default internet.exampleEmail call.

```txt
internet.exampleEmail()
```

Returns: `Edwin.Dibbert@example.net`

Shows internet.exampleEmail using firstName and lastName options.

```txt
internet.exampleEmail(firstName="Ada", lastName="Lovelace")
```

Returns: `Ada_Lovelace0@example.net`

Shows internet.exampleEmail allowing special characters.

```txt
internet.exampleEmail(allowSpecialCharacters=true)
```

Returns: `Edwin.Dibbert@example.net`

Shows internet.exampleEmail using an explicit first name.

```txt
internet.exampleEmail(firstName="Ada")
```

Returns: `Ada.Gutmann9@example.net`

Shows internet.exampleEmail using an explicit last name.

```txt
internet.exampleEmail(lastName="Lovelace")
```

Returns: `Edwin.Lovelace9@example.net`

### `internet.httpMethod`

Returns a random HTTP request method from an AnywayData-defined pool of GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS, TRACE, and CONNECT, with optional filtering for common methods and exclusions.

- Canonical: `awd.domain.internet.httpMethod`

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `commonOnly` | `boolean` | no | When true, limits generation to GET, HEAD, POST, PUT, and DELETE. Defaults to false. |
| `excludes` | `string` | no | Comma-separated HTTP methods to remove from the candidate set. Values are case-insensitive, surrounding spaces are trimmed, and generation throws if exclusions remove every available method. |

Examples:

Shows internet.httpMethod choosing from the full HTTP method set by default.

```txt
internet.httpMethod()
```

Returns: `PUT`

Shows internet.httpMethod restricted to the common request methods.

```txt
internet.httpMethod(commonOnly=true)
```

Returns: `POST`

Shows internet.httpMethod trimming spaces, normalizing case, and excluding methods from the full set.

```txt
internet.httpMethod(excludes="patch, TRACE")
```

Returns: `POST`

### `internet.httpStatusCode`

Generates a random HTTP status code.

- Canonical: `awd.domain.internet.httpStatusCode`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `types` | `array` | no | HTTP status categories to choose from. Allowed categories are informational, success, redirection, clientError, and serverError. |

Examples:

Shows the default internet.httpStatusCode call.

```txt
internet.httpStatusCode()
```

Returns: `306`

Shows internet.httpStatusCode constrained to success status codes.

```txt
internet.httpStatusCode(types=["success"])
```

Returns: `204`

### `internet.ip`

Generates a random IPv4 or IPv6 address.

- Canonical: `awd.domain.internet.ip`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

Shows the default internet.ip call.

```txt
internet.ip
```

Returns: `184.103.47.157`

### `internet.ipv4`

Generates a random IPv4 address.

- Canonical: `awd.domain.internet.ipv4`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `cidrBlock` | `string` | no | The optional CIDR block to use. Must be in the format x.x.x.x/y. |
| `network` | `any\|loopback\|private-a\|private-b\|private-c\|test-net-1\|test-net-2\|test-net-3\|link-local\|multicast` | no | The optional network to use. This is intended as an alias for well-known cidrBlocks. |

Examples:

Shows internet.ipv4 when optional params are omitted.

```txt
internet.ipv4()
```

Returns: `106.193.244.63`

Shows internet.ipv4 using cidrBlock.

```txt
internet.ipv4(cidrBlock="192.168.0.0/24")
```

Returns: `192.168.0.106`

Shows internet.ipv4 using network.

```txt
internet.ipv4(network="private-a")
```

Returns: `10.106.193.244`

### `internet.ipv6`

Generates a random IPv6 address.

- Canonical: `awd.domain.internet.ipv6`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

Shows the default internet.ipv6 call.

```txt
internet.ipv6
```

Returns: `9f06:3247:8b9f:4d0e:9c34:bf6f:dd10:3d29`

### `internet.jwt`

Generates a random JWT (JSON Web Token).

- Canonical: `awd.domain.internet.jwt`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `header` | `object` | no | The header to use for the token. If present, it will replace any default values. |
| `payload` | `object` | no | The payload to use for the token. If present, it will replace any default values. |
| `refDate` | `number` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

Shows internet.jwt when optional params are omitted.

```txt
internet.jwt()
```

Returns: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODE3NDc3NTAsImV4cCI6MTc4MTc0Nzc2MSwibmJmIjoxNzY5MzMwODQwLCJpc3MiOiJIZWdtYW5uIC0gSm9obnN0b24iLCJzdWIiOiJhM2UwYTY4Mi0zY2Y1LTRiZWUtYTEwMi1lMTZmOGI1YWQwY2YiLCJhdWQiOiI0YzE3ZTQ0Mi0wYTM0LTQ3MDktODI5Yi0xNmI2MDhhOGY5ZTIiLCJqdGkiOiJjNjJlNWNiZS05YzU0LTRlNmYtOWE5MS1mNzk2M2U5MDk1OGUifQ.UC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914u`

Shows internet.jwt using header.

```txt
internet.jwt(header={"value":"sample"})
```

Returns: `eyJ2YWx1ZSI6InNhbXBsZSJ9.eyJpYXQiOjE3ODE3NDc3NTAsImV4cCI6MTc4MTgwOTk4NywibmJmIjoxNzUwMjY5MzM0LCJpc3MiOiJEaWJiZXJ0IC0gTGluZCIsInN1YiI6IjZhM2UwYTY4LTIzY2YtNDViZS1iZTEwLTJlMTZmOGI1YWQwYyIsImF1ZCI6ImI0YzE3ZTQ0LTIwYTMtNDQ3MC04OTI5LWIxNmI2MDhhOGY5ZSIsImp0aSI6IjJjNjJlNWNiLWU5YzUtNDRlNi1iZmE5LTFmNzk2M2U5MDk1OCJ9.mUC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914`

Shows internet.jwt using payload.

```txt
internet.jwt(payload={"value":"sample"})
```

Returns: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWx1ZSI6InNhbXBsZSJ9.0i95bloxpGcS1Fpy8cNYjGST52aS6qXxGjGP1KZKhM6rUih81Gdgu3z9AH6pHp3x`

Shows internet.jwt using refDate.

```txt
internet.jwt(refDate=1718755200000)
```

Returns: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTg3MDQ4MzAsImV4cCI6MTcxODcwNDg0MSwibmJmIjoxNzA2Mjg3OTIwLCJpc3MiOiJIZWdtYW5uIC0gSm9obnN0b24iLCJzdWIiOiJhM2UwYTY4Mi0zY2Y1LTRiZWUtYTEwMi1lMTZmOGI1YWQwY2YiLCJhdWQiOiI0YzE3ZTQ0Mi0wYTM0LTQ3MDktODI5Yi0xNmI2MDhhOGY5ZTIiLCJqdGkiOiJjNjJlNWNiZS05YzU0LTRlNmYtOWE5MS1mNzk2M2U5MDk1OGUifQ.UC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914u`

### `internet.jwtAlgorithm`

Generates a random JWT (JSON Web Token) Algorithm.

- Canonical: `awd.domain.internet.jwtAlgorithm`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

Shows the default internet.jwtAlgorithm call.

```txt
internet.jwtAlgorithm
```

Returns: `HS512`

### `internet.mac`

Generates a random mac address.

- Canonical: `awd.domain.internet.mac`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `separator` | `":"\|"-"\|""` | no | The optional separator to use. Can be either ':', '-' or ''. |

Examples:

Shows internet.mac when optional params are omitted.

```txt
internet.mac()
```

Returns: `6b:04:21:25:68:6a`

Shows internet.mac using separator.

```txt
internet.mac(separator="-")
```

Returns: `6b-04-21-25-68-6a`

### `internet.password`

Generates a random password-like string. Do not use this method for generating actual passwords for users.

- Canonical: `awd.domain.internet.password`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `integer` | no | The length of the password to generate. |
| `memorable` | `boolean` | no | Whether the generated password should be memorable. |
| `pattern` | `regexp` | no | The pattern that all chars should match. This option will be ignored, if memorable is true. |
| `prefix` | `string` | no | The prefix to use. |

Examples:

Shows internet.password with all optional params omitted.

```txt
internet.password()
```

Returns: `He2AFTHb4tHV3mb`

Shows internet.password using only a custom length.

```txt
internet.password(length=12)
```

Returns: `He2AFTHb4tHV`

Shows internet.password using only the memorable flag.

```txt
internet.password(memorable=true)
```

Returns: `hefutisawetikub`

Shows internet.password generating a memorable password-like string.

```txt
internet.password(length=12, memorable=true)
```

Returns: `hefutisaweti`

Shows internet.password constrained only by a regex-style pattern.

```txt
internet.password(pattern="[A-Z]")
```

Returns: `HAFTHHVISKOWXHH`

Shows internet.password constrained by a regex-style pattern.

```txt
internet.password(length=12, memorable=false, pattern="[A-Z]")
```

Returns: `HAFTHHVISKOW`

Shows internet.password using only the prefix option.

```txt
internet.password(prefix="#")
```

Returns: `#He2AFTHb4tHV3m`

Shows internet.password using length, pattern, and prefix together.

```txt
internet.password(length=12, memorable=false, pattern="[A-Z]", prefix="#")
```

Returns: `#HAFTHHVISKO`

### `internet.port`

Generates a random port number.

- Canonical: `awd.domain.internet.port`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

Shows the default internet.port call.

```txt
internet.port
```

Returns: `27329`

### `internet.protocol`

Returns a random web protocol. Either `http` or `https`.

- Canonical: `awd.domain.internet.protocol`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

Shows the default internet.protocol call.

```txt
internet.protocol
```

Returns: `http`

### `internet.url`

Generates a random http(s) url.

- Canonical: `awd.domain.internet.url`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `appendSlash` | `boolean` | no | Whether to append a slash to the end of the url (path). |
| `protocol` | `http\|https` | no | The protocol to use. |

Examples:

Shows internet.url when optional params are omitted.

```txt
internet.url()
```

Returns: `https://self-reliant-cd.com/`

Shows internet.url using appendSlash.

```txt
internet.url(appendSlash=true)
```

Returns: `https://inferior-punctuation.biz/`

Shows internet.url using protocol.

```txt
internet.url(protocol="https")
```

Returns: `https://self-reliant-cd.com/`

### `internet.userAgent`

Generates a random user agent string.

- Canonical: `awd.domain.internet.userAgent`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

Shows the default internet.userAgent call.

```txt
internet.userAgent
```

Returns: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/586.0.30 (KHTML, like Gecko) Version/16.1 Safari/546.9.18`

### `internet.username`

Generates a username using the given person's name as base.

- Canonical: `awd.domain.internet.username`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `firstName` | `string` | no | The optional first name to use. |
| `lastName` | `string` | no | The optional last name to use. |

Examples:

Shows internet.username when optional params are omitted.

```txt
internet.username()
```

Returns: `Aaliyah.Bosco`

Shows internet.username using firstName.

```txt
internet.username(firstName="Ada")
```

Returns: `Ada.Abbott14`

Shows internet.username using lastName.

```txt
internet.username(lastName="Lovelace")
```

Returns: `Aaliyah.Lovelace14`
