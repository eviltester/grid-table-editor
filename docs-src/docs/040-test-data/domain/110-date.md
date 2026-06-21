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
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

Shows date.anytime when optional params are omitted.

```txt
date.anytime()
```

Returns: `2026-04-19T02:08:51.881Z`

Shows date.anytime using refDate.

```txt
date.anytime(refDate=1577836800000)
```

Returns: `2019-11-01T10:13:31.881Z`

### `date.between`

Generates a random date between the given boundaries.

- Canonical: `awd.domain.date.between`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `from` | `integer` | yes | Start boundary as a Unix timestamp in milliseconds since epoch. |
| `to` | `integer` | yes | End boundary as a Unix timestamp in milliseconds since epoch. |

Examples:

Shows date.between using explicit from and to timestamps.

```txt
date.between(from=1577836800000, to=1609372800000)
```

Returns: `2020-06-01T05:06:45.940Z`

Shows date.between with a different bounded range.

```txt
date.between(from=1609459200000, to=1640995200000)
```

Returns: `2021-06-02T05:06:45.940Z`

### `date.birthdate`

Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.

- Canonical: `awd.domain.date.birthdate`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |
| `max` | `integer` | no | The maximum age/year to generate a birthdate for/in. |
| `min` | `integer` | no | The minimum age/year to generate a birthdate for/in. |
| `mode` | `age\|year` | no | Either 'age' or 'year' to generate a birthdate based on the age or year range. |

Examples:

Shows date.birthdate in use.

```txt
date.birthdate(refDate=20000, max=69, min=16, mode="age")
```

Returns: `1922-07-10T12:11:49.191Z`

Shows date.birthdate when optional params are omitted.

```txt
date.birthdate()
```

Returns: `1971-09-27T08:09:14.757Z`

Shows date.birthdate using refDate.

```txt
date.birthdate(refDate=1577836800000)
```

Returns: `1965-04-10T16:13:54.757Z`

Shows date.birthdate using max.

```txt
date.birthdate(max=65)
```

Returns: `1980-06-25T11:25:42.848Z`

Shows date.birthdate using min.

```txt
date.birthdate(max=10, min=1)
```

Returns: `2019-08-20T15:04:00.805Z`

Shows date.birthdate using mode.

```txt
date.birthdate(mode="age")
```

Returns: `1971-09-27T08:09:14.757Z`

### `date.future`

Generates a random date in the future.

- Canonical: `awd.domain.date.future`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |
| `years` | `integer` | no | The range of years the date may be in the future. |

Examples:

Shows date.future when optional params are omitted.

```txt
date.future()
```

Returns: `2026-11-17T21:02:06.523Z`

Shows date.future using refDate.

```txt
date.future(refDate=1577836800000)
```

Returns: `2020-06-01T05:06:46.523Z`

Shows date.future using years.

```txt
date.future(years=2)
```

Returns: `2027-04-19T02:08:52.463Z`

### `date.month`

Returns a random name of a month.

- Canonical: `awd.domain.date.month`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | Whether to return an abbreviation. |
| `context` | `boolean` | no | Whether to return the name of a month in the context of a date. In the currently supported locale this has no visible effect. This option is mainly relevant for future multi-locale support (for example, locale-specific grammar/capitalization differences). |

Examples:

Shows date.month when optional params are omitted.

```txt
date.month()
```

Returns: `July`

Shows date.month using abbreviated.

```txt
date.month(abbreviated=true)
```

Returns: `Jul`

Shows date.month using context.

```txt
date.month(context=true)
```

Returns: `July`

### `date.past`

Generates a random date in the past.

- Canonical: `awd.domain.date.past`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |
| `years` | `integer` | no | The range of years the date may be in the past. |

Examples:

Shows date.past when optional params are omitted.

```txt
date.past()
```

Returns: `2025-11-17T21:02:05.523Z`

Shows date.past using refDate.

```txt
date.past(refDate=1577836800000)
```

Returns: `2019-06-02T05:06:45.523Z`

Shows date.past using years.

```txt
date.past(years=2)
```

Returns: `2025-04-19T02:08:51.463Z`

### `date.recent`

Generates a random date in the recent past.

- Canonical: `awd.domain.date.recent`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `days` | `integer` | no | The range of days the date may be in the past. |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

Shows date.recent when optional params are omitted.

```txt
date.recent()
```

Returns: `2026-06-18T01:55:50.284Z`

Shows date.recent using days.

```txt
date.recent(days=7)
```

Returns: `2026-06-14T13:58:54.491Z`

Shows date.recent using refDate.

```txt
date.recent(refDate=1577836800000)
```

Returns: `2019-12-31T10:00:30.284Z`

### `date.soon`

Generates a random date in the near future.

- Canonical: `awd.domain.date.soon`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `days` | `integer` | no | The range of days the date may be in the future. |
| `refDate` | `integer` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

Shows date.soon when optional params are omitted.

```txt
date.soon()
```

Returns: `2026-06-19T01:55:51.284Z`

Shows date.soon using days.

```txt
date.soon(days=7)
```

Returns: `2026-06-21T13:58:55.491Z`

Shows date.soon using refDate.

```txt
date.soon(refDate=1577836800000)
```

Returns: `2020-01-01T10:00:31.284Z`

### `date.timeZone`

Returns a random IANA time zone relevant to this locale.

- Canonical: `awd.domain.date.timeZone`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

No parameters.

Examples:

Shows the default date.timeZone call.

```txt
date.timeZone
```

Returns: `America/Santiago`

### `date.weekday`

Returns a random day of the week.

- Canonical: `awd.domain.date.weekday`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | Whether to return an abbreviation. |
| `context` | `boolean` | no | Whether to return the day of the week in the context of a date. In the currently supported locale this has no visible effect. This option is mainly relevant for future multi-locale support (for example, locale-specific grammar/capitalization differences). |

Examples:

Shows date.weekday when optional params are omitted.

```txt
date.weekday()
```

Returns: `Saturday`

Shows date.weekday using abbreviated.

```txt
date.weekday(abbreviated=true)
```

Returns: `Sat`

Shows date.weekday using context.

```txt
date.weekday(context=true)
```

Returns: `Saturday`
