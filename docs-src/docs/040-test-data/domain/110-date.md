---
sidebar_position: 110
title: "date Domain"
description: "Domain keyword reference for date."
---

# date Domain

The `date` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

## Methods

### `date.anytime`

Generates a random date that can be either in the past or in the future.

- Canonical: `awd.domain.date.anytime`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

```txt
date.anytime()
```

```txt
date.anytime(refDate=1577836800000)
```

Example return values:
- `2026-04-19T02:08:51.881Z`
- `2019-11-01T10:13:31.881Z`

### `date.between`

Generates a random date between the given boundaries.

- Canonical: `awd.domain.date.between`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `from` | `integer` | yes | Start boundary as a Unix timestamp in milliseconds since epoch. |
| `to` | `integer` | yes | End boundary as a Unix timestamp in milliseconds since epoch. |

Examples:

```txt
date.between(from=1577836800000, to=1609372800000)
```

```txt
date.between(from=1609459200000, to=1640995200000)
```

Example return values:
- `2020-06-01T05:06:45.940Z`
- `2021-06-02T05:06:45.940Z`

### `date.betweens`

Generates random dates between the given boundaries. The dates will be returned in an array sorted in chronological order.

- Canonical: `awd.domain.date.betweens`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | `integer` | no | The number of dates to generate. |
| `from` | `integer` | yes | Start boundary as a Unix timestamp in milliseconds since epoch. |
| `to` | `integer` | yes | End boundary as a Unix timestamp in milliseconds since epoch. |

Examples:

```txt
date.betweens(count=2, from=1577836800000, to=1609372800000)
```

```txt
date.betweens(count=3, from=1609459200000, to=1640995200000)
```

```txt
date.betweens(count=4, from=1640995200000, to=1672531200000)
```

Example return values:
- `["2020-06-01T05:06:45.940Z","2020-09-19T22:02:33.225Z"]`
- `["2021-01-01T01:00:06.924Z","2021-06-02T05:06:45.940Z","2021-09-20T22:02:33.225Z"]`
- `["2022-01-01T01:00:06.924Z","2022-04-21T08:26:00.010Z","2022-06-02T05:06:45.940Z","2022-09-20T22:02:33.225Z"]`

### `date.birthdate`

Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.

- Canonical: `awd.domain.date.birthdate`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |
| `max` | `integer` | no | The maximum age/year to generate a birthdate for/in. |
| `min` | `integer` | no | The minimum age/year to generate a birthdate for/in. |
| `mode` | `age\|year` | no | Either 'age' or 'year' to generate a birthdate based on the age or year range. |

Examples:

```txt
date.birthdate(refDate=20000, max=69, min=16, mode="age")
```

```txt
date.birthdate()
```

```txt
date.birthdate(refDate=1577836800000)
```

```txt
date.birthdate(max=65)
```

```txt
date.birthdate(max=10, min=1)
```

```txt
date.birthdate(mode="age")
```

Example return values:
- `1922-07-10T12:11:49.191Z`
- `1971-09-27T08:09:14.757Z`
- `1965-04-10T16:13:54.757Z`
- `1980-06-25T11:25:42.848Z`
- `2019-08-20T15:04:00.805Z`
- `1971-09-27T08:09:14.757Z`

### `date.future`

Generates a random date in the future.

- Canonical: `awd.domain.date.future`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |
| `years` | `integer` | no | The range of years the date may be in the future. |

Examples:

```txt
date.future()
```

```txt
date.future(refDate=1577836800000)
```

```txt
date.future(years=2)
```

Example return values:
- `2026-11-17T21:02:06.523Z`
- `2020-06-01T05:06:46.523Z`
- `2027-04-19T02:08:52.463Z`

### `date.month`

Returns a random name of a month.

- Canonical: `awd.domain.date.month`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | Whether to return an abbreviation. |
| `context` | `boolean` | no | Whether to return the name of a month in the context of a date. In the currently supported locale this has no visible effect. This option is mainly relevant for future multi-locale support (for example, locale-specific grammar/capitalization differences). |

Examples:

```txt
date.month()
```

```txt
date.month(abbreviated=true)
```

```txt
date.month(context=true)
```

Example return values:
- `July`
- `Jul`
- `July`

### `date.past`

Generates a random date in the past.

- Canonical: `awd.domain.date.past`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |
| `years` | `integer` | no | The range of years the date may be in the past. |

Examples:

```txt
date.past()
```

```txt
date.past(refDate=1577836800000)
```

```txt
date.past(years=2)
```

Example return values:
- `2025-11-17T21:02:05.523Z`
- `2019-06-02T05:06:45.523Z`
- `2025-04-19T02:08:51.463Z`

### `date.recent`

Generates a random date in the recent past.

- Canonical: `awd.domain.date.recent`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `days` | `integer` | no | The range of days the date may be in the past. |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

```txt
date.recent()
```

```txt
date.recent(days=7)
```

```txt
date.recent(refDate=1577836800000)
```

Example return values:
- `2026-06-18T01:55:50.284Z`
- `2026-06-14T13:58:54.491Z`
- `2019-12-31T10:00:30.284Z`

### `date.soon`

Generates a random date in the near future.

- Canonical: `awd.domain.date.soon`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `days` | `integer` | no | The range of days the date may be in the future. |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

```txt
date.soon()
```

```txt
date.soon(days=7)
```

```txt
date.soon(refDate=1577836800000)
```

Example return values:
- `2026-06-19T01:55:51.284Z`
- `2026-06-21T13:58:55.491Z`
- `2020-01-01T10:00:31.284Z`

### `date.timeZone`

Returns a random IANA time zone relevant to this locale.

- Canonical: `awd.domain.date.timeZone`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

No parameters.

Examples:

```txt
date.timeZone
```

Example return values:
- `America/Santiago`

### `date.weekday`

Returns a random day of the week.

- Canonical: `awd.domain.date.weekday`
- Docs: [https://anywaydata.com/docs/test-data/domain/date](https://anywaydata.com/docs/test-data/domain/date)
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | Whether to return an abbreviation. |
| `context` | `boolean` | no | Whether to return the day of the week in the context of a date. In the currently supported locale this has no visible effect. This option is mainly relevant for future multi-locale support (for example, locale-specific grammar/capitalization differences). |

Examples:

```txt
date.weekday()
```

```txt
date.weekday(abbreviated=true)
```

```txt
date.weekday(context=true)
```

Example return values:
- `Saturday`
- `Sat`
- `Saturday`
