---
sidebar_position: 180
title: "location Domain"
description: "Domain keyword reference for location."
---

# location Domain

The `location` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

## Methods

### `location.buildingNumber`

Generates a random building number.

- Canonical: `awd.domain.location.buildingNumber`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.buildingNumber()
```

Example return values:
- `5075`

### `location.cardinalDirection`

Returns a random cardinal direction (north, east, south, west).

- Canonical: `awd.domain.location.cardinalDirection`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.cardinalDirection()
```

Example return values:
- `East`

### `location.city`

Generates a random localized city name.

- Canonical: `awd.domain.location.city`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.city()
```

Example return values:
- `Stellachester`

### `location.continent`

Returns a random continent name.

- Canonical: `awd.domain.location.continent`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.continent()
```

Example return values:
- `Asia`

### `location.country`

Returns a random country name.

- Canonical: `awd.domain.location.country`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.country()
```

Example return values:
- `Svalbard & Jan Mayen Islands`

### `location.countryCode`

Returns a random ISO_3166-1 country code.

- Canonical: `awd.domain.location.countryCode`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.countryCode()
```

Example return values:
- `MG`

### `location.county`

Returns a random localized county, or other equivalent second-level administrative entity for the locale's country such as a district or department.

- Canonical: `awd.domain.location.county`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.county()
```

Example return values:
- `Northamptonshire`

### `location.direction`

Returns a random direction (cardinal and ordinal; northwest, east, etc).

- Canonical: `awd.domain.location.direction`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | If true this will return abbreviated directions (NW, E, etc). Otherwise this will return the long name. |

Examples:

```txt
location.direction()
```

```txt
location.direction(abbreviated=false)
```

Example return values:
- `North`

### `location.language`

Returns a random spoken language.

- Canonical: `awd.domain.location.language`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.language()
```

Example return values:
- `{"name":"Icelandic","alpha2":"is","alpha3":"isl"}`

### `location.latitude`

Generates a random latitude.

- Canonical: `awd.domain.location.latitude`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | The lower bound for the latitude to generate. |
| `max` | `number` | no | The upper bound for the latitude to generate. |
| `precision` | `number` | no | The number of decimal points of precision for the latitude. |

Examples:

```txt
location.latitude()
```

```txt
location.latitude(min=1, max=1, precision=1)
```

Example return values:
- `51.5448`

### `location.longitude`

Generates a random longitude.

- Canonical: `awd.domain.location.longitude`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | The lower bound for the longitude to generate. |
| `max` | `number` | no | The upper bound for the longitude to generate. |
| `precision` | `number` | no | The number of decimal points of precision for the longitude. |

Examples:

```txt
location.longitude()
```

```txt
location.longitude(min=1, max=1, precision=1)
```

Example return values:
- `92.3892`

### `location.nearbyGPSCoordinate`

Generates a random GPS coordinate within the specified radius from the given coordinate.

- Canonical: `awd.domain.location.nearbyGPSCoordinate`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.nearbyGPSCoordinate()
```

Example return values:
- `[58.313,9.9746]`

### `location.ordinalDirection`

Returns a random ordinal direction (northwest, southeast, etc).

- Canonical: `awd.domain.location.ordinalDirection`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.ordinalDirection()
```

Example return values:
- `Northeast`

### `location.secondaryAddress`

Generates a random localized secondary address. This refers to a specific location at a given address

- Canonical: `awd.domain.location.secondaryAddress`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.secondaryAddress()
```

Example return values:
- `Suite 634`

### `location.state`

Returns a random localized state, or other equivalent first-level administrative entity for the locale's country such as a province or region.

- Canonical: `awd.domain.location.state`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | If true this will return abbreviated first-level administrative entity names. Otherwise this will return the long name. |

Examples:

```txt
location.state()
```

```txt
location.state(abbreviated=false)
```

Example return values:
- `Hawaii`

### `location.street`

Generates a random localized street name.

- Canonical: `awd.domain.location.street`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.street()
```

Example return values:
- `Viva Harbor`

### `location.streetAddress`

Generates a random localized street address.

- Canonical: `awd.domain.location.streetAddress`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `useFullAddress` | `boolean` | no | Optional boolean argument for this command. |
| `value` | `boolean` | no | Legacy placeholder argument from Faker signatures; currently has no effect. Use the documented options instead. |

Examples:

```txt
location.streetAddress()
```

```txt
location.streetAddress(useFullAddress=true, value=true)
```

Example return values:
- `12056 Vandervort Common`

### `location.timeZone`

Returns a random IANA time zone name.

- Canonical: `awd.domain.location.timeZone`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.timeZone()
```

Example return values:
- `Australia/Perth`

### `location.zipCode`

Generates data using faker location zip code.

- Canonical: `awd.domain.location.zipCode`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.zipCode()
```

Example return values:
- `36791`
