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
| `refDate` | `number` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

```txt
date.anytime()
```

```txt
date.anytime(refDate=1)
```

Example return values:
- `"2025-11-22T12:30:53.535Z"`
- `"2026-03-09T05:03:13.667Z"`

### `date.between`

Generates a random date between the given boundaries.

- Canonical: `awd.domain.date.between`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `from` | `number` | no | Start boundary as a Unix timestamp in milliseconds since epoch. |
| `to` | `number` | no | End boundary as a Unix timestamp in milliseconds since epoch. |

Examples:

```txt
date.between(0, 2000000000000)
```

```txt
date.between(from=1, to=1)
```

Example return values:
- `"2001-01-03T09:27:56.772Z"`
- `"1988-04-02T17:24:17.440Z"`

### `date.betweens`

Generates random dates between the given boundaries. The dates will be returned in an array sorted in chronological order.

- Canonical: `awd.domain.date.betweens`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | `number` | no | The number of dates to generate. |
| `from` | `number` | no | Start boundary as a Unix timestamp in milliseconds since epoch. |
| `to` | `number` | no | End boundary as a Unix timestamp in milliseconds since epoch. |

Examples:

```txt
date.betweens(2, 0, 2000000000000)
```

```txt
date.betweens(count=1, from=1, to=1)
```

Example return values:
- `["1975-03-18T01:28:47.047Z","2005-08-03T07:55:22.524Z"]`
- `["1976-12-05T16:33:40.049Z","1978-06-04T00:02:41.826Z"]`

### `date.birthdate`

Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.

- Canonical: `awd.domain.date.birthdate`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `number` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |
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
- `"1955-05-18T19:25:36.178Z"`
- `"1993-02-06T15:43:56.865Z"`

### `date.future`

Generates a random date in the future.

- Canonical: `awd.domain.date.future`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `number` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |
| `years` | `number` | no | The range of years the date may be in the future. |

Examples:

```txt
date.future()
```

```txt
date.future(refDate=1, years=1)
```

Example return values:
- `"2026-10-12T16:19:33.811Z"`
- `"2026-11-24T03:18:00.421Z"`

### `date.month`

Returns a random name of a month.

- Canonical: `awd.domain.date.month`
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
date.month(abbreviated=false, context=false)
```

Example return values:
- `"May"`
- `"August"`

### `date.past`

Generates a random date in the past.

- Canonical: `awd.domain.date.past`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `refDate` | `number` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |
| `years` | `number` | no | The range of years the date may be in the past. |

Examples:

```txt
date.past()
```

```txt
date.past(refDate=1, years=1)
```

Example return values:
- `"2025-11-21T11:30:51.789Z"`
- `"2026-02-13T14:19:21.153Z"`

### `date.recent`

Generates a random date in the recent past.

- Canonical: `awd.domain.date.recent`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `days` | `number` | no | The range of days the date may be in the past. |
| `refDate` | `number` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

```txt
date.recent()
```

```txt
date.recent(days=1, refDate=1)
```

Example return values:
- `"2026-05-17T13:46:00.558Z"`
- `"2026-05-17T22:45:20.752Z"`

### `date.soon`

Generates a random date in the near future.

- Canonical: `awd.domain.date.soon`
- Faker docs: [https://fakerjs.dev/api/date](https://fakerjs.dev/api/date)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `days` | `number` | no | The range of days the date may be in the future. |
| `refDate` | `number` | no | Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor. |

Examples:

```txt
date.soon()
```

```txt
date.soon(days=1, refDate=1)
```

Example return values:
- `"2026-05-18T15:47:09.312Z"`
- `"2026-05-19T10:48:13.424Z"`

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
- `"Europe/Amsterdam"`
- `"America/Juneau"`

### `date.weekday`

Returns a random day of the week.

- Canonical: `awd.domain.date.weekday`
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
date.weekday(abbreviated=false, context=false)
```

Example return values:
- `"Thursday"`
- `"Tuesday"`
