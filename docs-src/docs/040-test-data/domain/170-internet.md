---
sidebar_position: 170
title: "internet Domain"
description: "Domain keyword reference for internet."
---

# internet Domain

The `internet` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

## Methods

### `internet.displayName`

Generates a display name using the given person's name as base.

- Canonical: `awd.domain.internet.displayName`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.displayName
```

Example return values:
- `Aaliyah.Bosco`

### `internet.domainName`

Generates a random domain name.

- Canonical: `awd.domain.internet.domainName`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.domainName
```

Example return values:
- `inferior-punctuation.biz`

### `internet.domainSuffix`

Returns a random domain suffix.

- Canonical: `awd.domain.internet.domainSuffix`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.domainSuffix
```

Example return values:
- `info`

### `internet.domainWord`

Generates a random domain word.

- Canonical: `awd.domain.internet.domainWord`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.domainWord
```

Example return values:
- `inferior-punctuation`

### `internet.email`

Generates data using faker internet email.

- Canonical: `awd.domain.internet.email`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
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
internet.email(allowSpecialCharacters=true)
```

```txt
internet.email(firstName="Ada")
```

```txt
internet.email(lastName="Lovelace")
```

```txt
internet.email(provider="example.com")
```

Example return values:
- `Edwin.Dibbert@hotmail.com`
- `Edwin.Dibbert@hotmail.com`
- `Ada.Gutmann9@hotmail.com`
- `Edwin.Lovelace9@hotmail.com`
- `Aaliyah.Bosco@example.com`

### `internet.emoji`

Generates a random emoji.

- Canonical: `awd.domain.internet.emoji`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `types` | `array` | no | A list of the emoji types that should be used. |

Examples:

```txt
internet.emoji()
```

```txt
internet.emoji(types=["food"])
```

Example return values:
- `🥣`
- `🍲`

### `internet.exampleEmail`

Generates data using faker internet example email.

- Canonical: `awd.domain.internet.exampleEmail`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.exampleEmail
```

Example return values:
- `Edwin.Dibbert@example.net`

### `internet.httpMethod`

Returns a random http method.

- Canonical: `awd.domain.internet.httpMethod`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.httpMethod
```

Example return values:
- `PUT`

### `internet.httpStatusCode`

Generates a random HTTP status code.

- Canonical: `awd.domain.internet.httpStatusCode`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.httpStatusCode
```

Example return values:
- `306`

### `internet.ip`

Generates a random IPv4 or IPv6 address.

- Canonical: `awd.domain.internet.ip`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.ip
```

Example return values:
- `184.103.47.157`

### `internet.ipv4`

Generates a random IPv4 address.

- Canonical: `awd.domain.internet.ipv4`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `cidrBlock` | `string` | no | The optional CIDR block to use. Must be in the format x.x.x.x/y. |
| `network` | `any\|loopback\|private-a\|private-b\|private-c\|test-net-1\|test-net-2\|test-net-3\|link-local\|multicast` | no | The optional network to use. This is intended as an alias for well-known cidrBlocks. |

Examples:

```txt
internet.ipv4()
```

```txt
internet.ipv4(cidrBlock="192.168.0.0/24")
```

```txt
internet.ipv4(network="private-a")
```

Example return values:
- `106.193.244.63`
- `192.168.0.106`
- `10.106.193.244`

### `internet.ipv6`

Generates a random IPv6 address.

- Canonical: `awd.domain.internet.ipv6`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.ipv6
```

Example return values:
- `9f06:3247:8b9f:4d0e:9c34:bf6f:dd10:3d29`

### `internet.jwt`

Generates a random JWT (JSON Web Token).

- Canonical: `awd.domain.internet.jwt`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `header` | `object` | no | The header to use for the token. If present, it will replace any default values. |
| `payload` | `object` | no | The payload to use for the token. If present, it will replace any default values. |
| `refDate` | `number` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

```txt
internet.jwt()
```

```txt
internet.jwt(header={"value":"sample"})
```

```txt
internet.jwt(payload={"value":"sample"})
```

```txt
internet.jwt(refDate=1718755200000)
```

Example return values:
- `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODE3NDc3NTAsImV4cCI6MTc4MTc0Nzc2MSwibmJmIjoxNzY5MzMwODQwLCJpc3MiOiJIZWdtYW5uIC0gSm9obnN0b24iLCJzdWIiOiJhM2UwYTY4Mi0zY2Y1LTRiZWUtYTEwMi1lMTZmOGI1YWQwY2YiLCJhdWQiOiI0YzE3ZTQ0Mi0wYTM0LTQ3MDktODI5Yi0xNmI2MDhhOGY5ZTIiLCJqdGkiOiJjNjJlNWNiZS05YzU0LTRlNmYtOWE5MS1mNzk2M2U5MDk1OGUifQ.UC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914u`
- `eyJ2YWx1ZSI6InNhbXBsZSJ9.eyJpYXQiOjE3ODE3NDc3NTAsImV4cCI6MTc4MTgwOTk4NywibmJmIjoxNzUwMjY5MzM0LCJpc3MiOiJEaWJiZXJ0IC0gTGluZCIsInN1YiI6IjZhM2UwYTY4LTIzY2YtNDViZS1iZTEwLTJlMTZmOGI1YWQwYyIsImF1ZCI6ImI0YzE3ZTQ0LTIwYTMtNDQ3MC04OTI5LWIxNmI2MDhhOGY5ZSIsImp0aSI6IjJjNjJlNWNiLWU5YzUtNDRlNi1iZmE5LTFmNzk2M2U5MDk1OCJ9.mUC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914`
- `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWx1ZSI6InNhbXBsZSJ9.0i95bloxpGcS1Fpy8cNYjGST52aS6qXxGjGP1KZKhM6rUih81Gdgu3z9AH6pHp3x`
- `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTg3MDQ4MzAsImV4cCI6MTcxODcwNDg0MSwibmJmIjoxNzA2Mjg3OTIwLCJpc3MiOiJIZWdtYW5uIC0gSm9obnN0b24iLCJzdWIiOiJhM2UwYTY4Mi0zY2Y1LTRiZWUtYTEwMi1lMTZmOGI1YWQwY2YiLCJhdWQiOiI0YzE3ZTQ0Mi0wYTM0LTQ3MDktODI5Yi0xNmI2MDhhOGY5ZTIiLCJqdGkiOiJjNjJlNWNiZS05YzU0LTRlNmYtOWE5MS1mNzk2M2U5MDk1OGUifQ.UC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914u`

### `internet.jwtAlgorithm`

Generates a random JWT (JSON Web Token) Algorithm.

- Canonical: `awd.domain.internet.jwtAlgorithm`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.jwtAlgorithm
```

Example return values:
- `HS512`

### `internet.mac`

Generates a random mac address.

- Canonical: `awd.domain.internet.mac`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `separator` | `":"\|"-"\|""` | no | The optional separator to use. Can be either ':', '-' or ''. |

Examples:

```txt
internet.mac()
```

```txt
internet.mac(separator="-")
```

Example return values:
- `6b:04:21:25:68:6a`
- `6b-04-21-25-68-6a`

### `internet.password`

Generates a random password-like string. Do not use this method for generating actual passwords for users.

- Canonical: `awd.domain.internet.password`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `integer` | no | The length of the password to generate. |
| `memorable` | `boolean` | no | Whether the generated password should be memorable. |
| `pattern` | `regexp` | no | The pattern that all chars should match. This option will be ignored, if memorable is true. |
| `prefix` | `string` | no | The prefix to use. |

Examples:

```txt
internet.password()
```

```txt
internet.password(length=12)
```

```txt
internet.password(memorable=true)
```

```txt
internet.password(length=12, memorable=true)
```

```txt
internet.password(pattern="[A-Z]")
```

```txt
internet.password(length=12, memorable=false, pattern="[A-Z]")
```

```txt
internet.password(prefix="#")
```

```txt
internet.password(length=12, memorable=false, pattern="[A-Z]", prefix="#")
```

Example return values:
- `He2AFTHb4tHV3mb`
- `He2AFTHb4tHV`
- `hefutisawetikub`
- `hefutisaweti`
- `HAFTHHVISKOWXHH`
- `HAFTHHVISKOW`
- `#He2AFTHb4tHV3m`
- `#HAFTHHVISKO`

### `internet.port`

Generates a random port number.

- Canonical: `awd.domain.internet.port`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.port
```

Example return values:
- `27329`

### `internet.protocol`

Returns a random web protocol. Either `http` or `https`.

- Canonical: `awd.domain.internet.protocol`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.protocol
```

Example return values:
- `http`

### `internet.url`

Generates a random http(s) url.

- Canonical: `awd.domain.internet.url`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `appendSlash` | `boolean` | no | Whether to append a slash to the end of the url (path). |
| `protocol` | `http\|https` | no | The protocol to use. |

Examples:

```txt
internet.url()
```

```txt
internet.url(appendSlash=true)
```

```txt
internet.url(protocol="https")
```

Example return values:
- `https://self-reliant-cd.com/`
- `https://inferior-punctuation.biz/`
- `https://self-reliant-cd.com/`

### `internet.userAgent`

Generates a random user agent string.

- Canonical: `awd.domain.internet.userAgent`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

No parameters.

Examples:

```txt
internet.userAgent
```

Example return values:
- `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/586.0.30 (KHTML, like Gecko) Version/16.1 Safari/546.9.18`

### `internet.username`

Generates a username using the given person's name as base.

- Canonical: `awd.domain.internet.username`
- Docs: [https://anywaydata.com/docs/test-data/domain/internet](https://anywaydata.com/docs/test-data/domain/internet)
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
internet.username(firstName="Ada")
```

```txt
internet.username(lastName="Lovelace")
```

Example return values:
- `Aaliyah.Bosco`
- `Ada.Abbott14`
- `Aaliyah.Lovelace14`
