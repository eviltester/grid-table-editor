---
sidebar_position: 100
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
| `refDate` | `number` | no | The date to use as reference point for the newly generated date. |

Examples:

```txt
date.anytime()
```

```txt
date.anytime(refDate=1)
```

Example return values:
- `"2025-08-05T17:44:20.249Z"`
- `"2026-12-11T20:53:23.217Z"`

### `date.between`

Generates a random date between the given boundaries.

- Canonical: `awd.domain.date.between`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `from` | `number` | no | The early date boundary. |
| `to` | `number` | no | The late date boundary. |

Examples:

```txt
date.between(0, 2000000000000)
```

```txt
date.between(from=1, to=1)
```

Example return values:
- `"1973-05-28T03:48:00.522Z"`
- `"2031-11-26T20:33:58.073Z"`

### `date.betweens`

Generates random dates between the given boundaries. The dates will be returned in an array sorted in chronological order.

- Canonical: `awd.domain.date.betweens`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | `number` | no | The number of dates to generate. |
| `from` | `number` | no | The early date boundary. |
| `to` | `number` | no | The late date boundary. |

Examples:

```txt
date.betweens(2, 0, 2000000000000)
```

```txt
date.betweens(count=1, from=1, to=1)
```

Example return values:
- `["1994-04-21T22:56:21.974Z","2030-05-23T14:54:54.613Z"]`
- `["1980-04-04T15:41:37.663Z","2026-06-20T08:28:52.333Z"]`

### `date.birthdate`

Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.

- Canonical: `awd.domain.date.birthdate`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `number` | no | The date to use as reference point for the newly generated date. |
| `max` | `number` | no | The maximum age/year to generate a birthdate for/in. |
| `min` | `number` | no | The minimum age/year to generate a birthdate for/in. |
| `mode` | `string` | no | Either 'age' or 'year' to generate a birthdate based on the age or year range. |

Examples:

```txt
date.birthdate()
```

```txt
date.birthdate(refDate=1)
```

Example return values:
- `"1954-09-12T10:56:09.274Z"`
- `"2004-06-13T21:20:04.192Z"`

### `date.future`

Generates a random date in the future.

- Canonical: `awd.domain.date.future`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `number` | no | The date to use as reference point for the newly generated date. |
| `years` | `number` | no | The range of years the date may be in the future. |

Examples:

```txt
date.future()
```

```txt
date.future(refDate=1)
```

Example return values:
- `"2026-09-27T01:54:58.853Z"`
- `"2026-12-31T21:43:48.329Z"`

### `date.month`

Returns a random name of a month.

- Canonical: `awd.domain.date.month`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | Whether to return an abbreviation. |
| `context` | `boolean` | no | Whether to return the name of a month in the context of a date. In the default en locale this has no effect, however, in other locales like fr or ru, this may affect grammar or capitalization, for example 'январь' with { context: false } and 'января' with { context: true } in ru. |

Examples:

```txt
date.month()
```

```txt
date.month(abbreviated=false)
```

Example return values:
- `"October"`
- `"September"`

### `date.past`

Generates a random date in the past.

- Canonical: `awd.domain.date.past`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `number` | no | The date to use as reference point for the newly generated date. |
| `years` | `number` | no | The range of years the date may be in the past. |

Examples:

```txt
date.past()
```

```txt
date.past(refDate=1)
```

Example return values:
- `"2025-12-15T15:16:45.352Z"`
- `"2025-08-22T22:02:22.320Z"`

### `date.recent`

Generates a random date in the recent past.

- Canonical: `awd.domain.date.recent`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `days` | `number` | no | The range of days the date may be in the past. |
| `refDate` | `number` | no | The date to use as reference point for the newly generated date. |

Examples:

```txt
date.recent()
```

```txt
date.recent(days=1)
```

Example return values:
- `"2026-05-17T17:36:54.204Z"`
- `"2026-05-18T02:00:07.277Z"`

### `date.soon`

Generates a random date in the near future.

- Canonical: `awd.domain.date.soon`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `days` | `number` | no | The range of days the date may be in the future. |
| `refDate` | `number` | no | The date to use as reference point for the newly generated date. |

Examples:

```txt
date.soon()
```

```txt
date.soon(days=1)
```

Example return values:
- `"2026-05-18T23:55:15.404Z"`
- `"2026-05-19T00:09:48.267Z"`

### `date.timeZone`

Returns a random IANA time zone relevant to this locale.

- Canonical: `awd.domain.date.timeZone`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

No parameters.

Examples:

```txt
date.timeZone()
```

Example return values:
- `"Australia/Sydney"`
- `"Asia/Kuwait"`

### `date.weekday`

Returns a random day of the week.

- Canonical: `awd.domain.date.weekday`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | Whether to return an abbreviation. |
| `context` | `boolean` | no | Whether to return the day of the week in the context of a date. In the default en locale this has no effect, however, in other locales like fr or ru, this may affect grammar or capitalization, for example 'Lundi' with { context: false } and 'lundi' with { context: true } in fr. |

Examples:

```txt
date.weekday()
```

```txt
date.weekday(abbreviated=false)
```

Example return values:
- `"Thursday"`
- `"Monday"`
