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
- `"2026-11-16T12:31:26.233Z"`
- `"2026-09-01T01:40:55.021Z"`

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
- `"2017-11-28T21:36:32.679Z"`
- `"1986-05-03T09:28:02.047Z"`

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
- `["2003-02-24T12:13:48.103Z","2025-07-02T14:14:42.037Z"]`
- `["2011-05-22T07:45:07.090Z","2029-10-03T22:27:10.427Z"]`

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
date.birthdate(refDate=1, max=1, min=1, mode="age")
```

Example return values:
- `"1947-02-19T15:30:09.049Z"`
- `"1975-03-06T00:05:29.318Z"`

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
date.future(refDate=1, years=1)
```

Example return values:
- `"2026-12-30T02:39:09.785Z"`
- `"2026-09-23T01:35:35.111Z"`

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
date.month(abbreviated=false, context=false)
```

Example return values:
- `"January"`
- `"April"`

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
date.past(refDate=1, years=1)
```

Example return values:
- `"2025-09-05T09:19:52.631Z"`
- `"2026-04-16T07:47:17.776Z"`

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
date.recent(days=1, refDate=1)
```

Example return values:
- `"2026-05-17T12:43:57.737Z"`
- `"2026-05-17T13:05:20.410Z"`

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
date.soon(days=1, refDate=1)
```

Example return values:
- `"2026-05-19T08:43:21.767Z"`
- `"2026-05-19T06:52:57.958Z"`

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
- `"Asia/Samarkand"`
- `"America/Dominica"`

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
date.weekday(abbreviated=false, context=false)
```

Example return values:
- `"Wednesday"`
- `"Saturday"`
