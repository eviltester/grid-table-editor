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
- `"5098"`
- `"8232"`

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
- `"West"`
- `"West"`

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
- `"Neldachester"`
- `"East Libbychester"`

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
- `"Antarctica"`
- `"Asia"`

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
- `"Indonesia"`
- `"Iraq"`

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
- `"PE"`
- `"KI"`

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
- `"Rutland"`
- `"Washington County"`

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
- `"East"`
- `"North"`

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
- `{"name":"Tagalog","alpha2":"tl","alpha3":"tgl"}`
- `{"name":"Azerbaijani","alpha2":"az","alpha3":"aze"}`

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
- `38.5893`
- `57.5593`

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
- `-174.1417`
- `100.7973`

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
- `[-5.738,-37.5877]`
- `[30.3643,59.1147]`

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
- `"Southwest"`
- `"Southeast"`

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
- `"Suite 588"`
- `"Apt. 105"`

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
- `"New Hampshire"`
- `"Louisiana"`

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
- `"Kemmer Forges"`
- `"Labadie Extension"`

### `location.streetAddress`

Generates a random localized street address.

- Canonical: `awd.domain.location.streetAddress`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `useFullAddress` | `boolean` | no | When true, generates a fuller address variant (for example including additional address detail). When false or omitted, generates a standard street address. |

Examples:

```txt
location.streetAddress()
```

```txt
location.streetAddress(useFullAddress=true)
```

Example return values:
- `"24973 Steuber Skyway"`
- `"555 Kali Summit"`

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
- `"America/Anchorage"`
- `"Asia/Pyongyang"`

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
- `"24867"`
- `"55040-0535"`
