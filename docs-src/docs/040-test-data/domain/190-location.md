---
sidebar_position: 190
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
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.buildingNumber
```

Example return values:
- `7031`

### `location.cardinalDirection`

Returns a random cardinal direction (north, east, south, west).

- Canonical: `awd.domain.location.cardinalDirection`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.cardinalDirection
```

Example return values:
- `East`

### `location.city`

Generates a random localized city name.

- Canonical: `awd.domain.location.city`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.city
```

Example return values:
- `Edwinville`

### `location.continent`

Returns a random continent name.

- Canonical: `awd.domain.location.continent`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.continent
```

Example return values:
- `Asia`

### `location.country`

Returns a random country name.

- Canonical: `awd.domain.location.country`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.country
```

Example return values:
- `India`

### `location.countryCode`

Returns a random ISO_3166-1 country code.

- Canonical: `awd.domain.location.countryCode`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `variant` | `alpha-2\|alpha-3\|numeric` | no | The code to return. Can be either 'alpha-2' (two-letter code), 'alpha-3' (three-letter code) or 'numeric' (numeric code). |

Examples:

```txt
location.countryCode()
```

```txt
location.countryCode(variant="alpha-3")
```

Example return values:
- `IM`
- `IMN`

### `location.county`

Returns a random localized county, or other equivalent second-level administrative entity for the locale's country such as a district or department.

- Canonical: `awd.domain.location.county`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.county
```

Example return values:
- `Cleveland`

### `location.direction`

Returns a random direction (cardinal and ordinal; northwest, east, etc).

- Canonical: `awd.domain.location.direction`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | If true this will return abbreviated directions (NW, E, etc). Otherwise this will return the long name. |

Examples:

```txt
location.direction()
```

```txt
location.direction(abbreviated=true)
```

Example return values:
- `West`
- `W`

### `location.language`

Returns a random spoken language.

- Canonical: `awd.domain.location.language`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.language
```

Example return values:
- `{"name":"Punjabi","alpha2":"pa","alpha3":"pan"}`

### `location.latitude`

Generates a random latitude.

- Canonical: `awd.domain.location.latitude`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
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
location.latitude(max=10, min=1)
```

```txt
location.latitude(max=5)
```

```txt
location.latitude(precision=1)
```

Example return values:
- `-14.936`
- `4.7532`
- `-50.3829`
- `-14.9`

### `location.longitude`

Generates a random longitude.

- Canonical: `awd.domain.location.longitude`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
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
location.longitude(max=10, min=1)
```

```txt
location.longitude(max=5)
```

```txt
location.longitude(precision=1)
```

Example return values:
- `-29.8721`
- `4.7532`
- `-102.8509`
- `-29.9`

### `location.nearbyGPSCoordinate`

Generates a random GPS coordinate within the specified radius from the given coordinate.

- Canonical: `awd.domain.location.nearbyGPSCoordinate`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.nearbyGPSCoordinate
```

Example return values:
- `[-14.936,79.3168]`

### `location.ordinalDirection`

Returns a random ordinal direction (northwest, southeast, etc).

- Canonical: `awd.domain.location.ordinalDirection`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.ordinalDirection
```

Example return values:
- `Northwest`

### `location.secondaryAddress`

Generates a random localized secondary address. This refers to a specific location at a given address

- Canonical: `awd.domain.location.secondaryAddress`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.secondaryAddress
```

Example return values:
- `Apt. 703`

### `location.state`

Returns a random localized state, or other equivalent first-level administrative entity for the locale's country such as a province or region.

- Canonical: `awd.domain.location.state`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | If true this will return abbreviated first-level administrative entity names. Otherwise this will return the long name. |

Examples:

```txt
location.state()
```

```txt
location.state(abbreviated=true)
```

Example return values:
- `Massachusetts`
- `MA`

### `location.street`

Generates a random localized street name.

- Canonical: `awd.domain.location.street`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.street
```

Example return values:
- `Gutmann Creek`

### `location.streetAddress`

Generates a random localized street address.

- Canonical: `awd.domain.location.streetAddress`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `useFullAddress` | `boolean` | no | Whether to expand to a full address including secondary address information. |

Examples:

```txt
location.streetAddress()
```

```txt
location.streetAddress(useFullAddress=true)
```

Example return values:
- `7031 Iris Mill`
- `7031 Iris Mill Apt. 728`

### `location.timeZone`

Returns a random IANA time zone name.

- Canonical: `awd.domain.location.timeZone`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.timeZone
```

Example return values:
- `America/Santiago`

### `location.zipCode`

Generates data using faker location zip code.

- Canonical: `awd.domain.location.zipCode`
- Docs: [https://anywaydata.com/docs/test-data/domain/location](https://anywaydata.com/docs/test-data/domain/location)
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

```txt
location.zipCode
```

Example return values:
- `70310`
