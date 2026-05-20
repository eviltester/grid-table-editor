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
- `#290551`

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
- `Cordell0`

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
- `beloved-peony.org`

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
- `com`

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
- `inexperienced-ravioli`

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
internet.email(allowSpecialCharacters=true, firstName="Alex", lastName="Taylor", provider="example.com")
```

Example return values:
- `Jana91@hotmail.com`

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
- `🤨`

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
- `Jeremie37@example.net`

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
- `PATCH`

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
- `303`

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
- `56.23.30.52`

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
- `192.168.0.42`

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
- `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

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

```txt
internet.jwt()
```

```txt
internet.jwt(header={"alg":"HS256","typ":"JWT"}, payload={"iss":"Acme"}, refDate=1)
```

Example return values:
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBY21lIn0.c2lnbmF0dXJl`

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
- `PS384`

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
- `ae:a9:d7:ba:d2:bd`

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
internet.password(length=1, memorable=false, pattern="[A-Za-z0-9]", prefix="#")
```

Example return values:
- `og1ejoksrfwVbIF`

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
- `24545`

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
- `http`

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
internet.url(appendSlash=true, protocol="https")
```

Example return values:
- `https://brave-interior.biz/`

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
- `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36`

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
internet.username(firstName="Alex", lastName="Taylor")
```

Example return values:
- `Deanna51`

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
- `Ana_Keebler`
