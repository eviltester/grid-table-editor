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
- `"#261012"`
- `"#5a7444"`

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
- `"Ben.Hintz"`
- `"Lydia20"`

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
- `"every-trolley.org"`
- `"elastic-hepatitis.name"`

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
- `"biz"`
- `"com"`

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
- `"ornate-vista"`
- `"frizzy-doubter"`

### `internet.email`

Generates data using faker internet email.

- Canonical: `awd.domain.internet.email`
- Faker docs: [https://fakerjs.dev/api/internet](https://fakerjs.dev/api/internet)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `allowSpecialCharacters` | `boolean` | no | Whether special characters such as .!#$%&'*+-/=?^_`{|}~ should be included in the email address. |
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
- `"Marco.Bogan40@gmail.com"`
- `"Rozella_Swaniawski37@yahoo.com"`

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
- `"📲"`
- `"😀"`

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
- `"Elenor_Welch@example.com"`
- `"Shayne29@example.net"`

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
- `"POST"`
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
- `428`
- `305`

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
- `"bcd4:cd4b:fab5:0ca9:b7c3:3cd3:da7b:e1f9"`
- `"158.22.244.203"`

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
- `"206.125.206.245"`
- `"89.168.239.153"`

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
- `"02db:bfaa:afbd:de77:b75d:8904:e3fa:5108"`
- `"3894:75f7:fffd:2df0:df39:cb88:ebf1:ad1d"`

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
- `"eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzkwMzY0NzIsImV4cCI6MTc3OTA2OTM4MCwibmJmIjoxNzc0NTYyODY3LCJpc3MiOiJTbWl0aGFtLCBHdXNpa293c2tpIGFuZCBMZWdyb3MiLCJzdWIiOiIyOTI3NmUyYS05Y2I5LTQyNGEtYWNjMS1iZDdmNGZmNDRhOWUiLCJhdWQiOiJiZmNkYWZlMC00Y2ExLTRmNWQtOTZiMy1lNGZjODVlZmIyZDMiLCJqdGkiOiJkMmNiM2JjOC00YTUyLTRlOTEtYmQzMS0yN2I5NDg1N2RmYjQifQ.HCVgvP6rGliA17BNydO1KgD8ie7eVx4w1ZkgGaTgeTSYp4pIh0jye8yhMUVEXoVy"`
- `"eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzkwNDQzNjcsImV4cCI6MTc3OTExNjkzMCwibmJmIjoxODAxNTI1OTg4LCJpc3MiOiJIYWFnIExMQyIsInN1YiI6IjExZDcwN2IxLTllMDAtNGZiZi04NjQ0LTM2NjNiYjA5N2I2MyIsImF1ZCI6Ijc2YTc1NWQyLWU0YmUtNDI3Mi05NmM4LTBlZGRjM2QxOTBlYyIsImp0aSI6IjJkNzZiZjg4LWIxYjUtNDAxMy04ZTM4LWVjNDM3NWU1YjExNCJ9.9gBrAYYajUJTdLKhwxBzctNj8r1MXm90m2GKS9JP0kbxxMNM7xHb7O456ywOK7Xu"`

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
- `"HS512"`
- `"RS384"`

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
- `"ed:c4:9c:15:7b:6b"`
- `"bb:d2:c2:c8:0f:d3"`

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
- `"AL__7nIYjyDwAEs"`
- `"hVJNDFA48bX6rtv"`

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
- `55976`
- `49210`

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
- `"http"`

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
- `"https://failing-pants.biz/"`
- `"https://mixed-academics.net/"`

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
- `"Mozilla/5.0 (Linux; Android 11; SM-G998U) AppleWebKit/542.69 (KHTML, like Gecko) Chrome/104.7.14.4 Mobile Safari/580.34"`
- `"Mozilla/5.0 (Windows NT 6.0; Win64; x64) AppleWebKit/539.48 (KHTML, like Gecko) Chrome/111.5.9.15 Safari/581.76 Edg/121.0.5.20"`

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
- `"Elizabeth.Zulauf"`
- `"Terry64"`

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
- `"Justine8"`
- `"Quinton_Ritchie13"`
