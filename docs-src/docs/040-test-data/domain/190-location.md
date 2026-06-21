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

### `language.alpha2`

Returns a random ISO 639-1 language code.

- Canonical: `awd.domain.location.language.alpha2`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.language.alpha2 call.

```txt
location.language.alpha2
```

Returns: `pa`

### `language.alpha3`

Returns a random ISO 639-2 or ISO 639-3 language code.

- Canonical: `awd.domain.location.language.alpha3`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.language.alpha3 call.

```txt
location.language.alpha3
```

Returns: `pan`

### `language.name`

Returns a random spoken language name.

- Canonical: `awd.domain.location.language.name`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.language.name call.

```txt
location.language.name
```

Returns: `Punjabi`

### `location.buildingNumber`

Generates a random building number.

- Canonical: `awd.domain.location.buildingNumber`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.buildingNumber call.

```txt
location.buildingNumber
```

Returns: `7031`

### `location.cardinalDirection`

Returns a random cardinal direction (north, east, south, west).

- Canonical: `awd.domain.location.cardinalDirection`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.cardinalDirection call.

```txt
location.cardinalDirection
```

Returns: `East`

### `location.city`

Generates a random localized city name.

- Canonical: `awd.domain.location.city`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.city call.

```txt
location.city
```

Returns: `Edwinville`

### `location.continent`

Returns a random continent name.

- Canonical: `awd.domain.location.continent`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.continent call.

```txt
location.continent
```

Returns: `Asia`

### `location.country`

Returns a random country name.

- Canonical: `awd.domain.location.country`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.country call.

```txt
location.country
```

Returns: `India`

### `location.countryCode`

Returns a random ISO_3166-1 country code.

- Canonical: `awd.domain.location.countryCode`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `variant` | `alpha-2\|alpha-3\|numeric` | no | The code to return. Can be either 'alpha-2' (two-letter code), 'alpha-3' (three-letter code) or 'numeric' (numeric code). |

Examples:

Shows location.countryCode when optional params are omitted.

```txt
location.countryCode()
```

Returns: `IM`

Shows location.countryCode using variant.

```txt
location.countryCode(variant="alpha-3")
```

Returns: `IMN`

### `location.county`

Returns a random localized county, or other equivalent second-level administrative entity for the locale's country such as a district or department.

- Canonical: `awd.domain.location.county`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.county call.

```txt
location.county
```

Returns: `Cleveland`

### `location.direction`

Returns a random direction (cardinal and ordinal; northwest, east, etc).

- Canonical: `awd.domain.location.direction`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | If true this will return abbreviated directions (NW, E, etc). Otherwise this will return the long name. |

Examples:

Shows location.direction when optional params are omitted.

```txt
location.direction()
```

Returns: `West`

Shows location.direction using abbreviated.

```txt
location.direction(abbreviated=true)
```

Returns: `W`

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

Shows location.latitude when optional params are omitted.

```txt
location.latitude()
```

Returns: `-14.936`

Shows location.latitude using min.

```txt
location.latitude(max=10, min=1)
```

Returns: `4.7532`

Shows location.latitude using max.

```txt
location.latitude(max=5)
```

Returns: `-50.3829`

Shows location.latitude using precision.

```txt
location.latitude(precision=1)
```

Returns: `-14.9`

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

Shows location.longitude when optional params are omitted.

```txt
location.longitude()
```

Returns: `-29.8721`

Shows location.longitude using min.

```txt
location.longitude(max=10, min=1)
```

Returns: `4.7532`

Shows location.longitude using max.

```txt
location.longitude(max=5)
```

Returns: `-102.8509`

Shows location.longitude using precision.

```txt
location.longitude(precision=1)
```

Returns: `-29.9`

### `location.ordinalDirection`

Returns a random ordinal direction (northwest, southeast, etc).

- Canonical: `awd.domain.location.ordinalDirection`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.ordinalDirection call.

```txt
location.ordinalDirection
```

Returns: `Northwest`

### `location.secondaryAddress`

Generates a random localized secondary address. This refers to a specific location at a given address

- Canonical: `awd.domain.location.secondaryAddress`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.secondaryAddress call.

```txt
location.secondaryAddress
```

Returns: `Apt. 703`

### `location.state`

Returns a random localized state, or other equivalent first-level administrative entity for the locale's country such as a province or region.

- Canonical: `awd.domain.location.state`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `abbreviated` | `boolean` | no | If true this will return abbreviated first-level administrative entity names. Otherwise this will return the long name. |

Examples:

Shows location.state when optional params are omitted.

```txt
location.state()
```

Returns: `Massachusetts`

Shows location.state using abbreviated.

```txt
location.state(abbreviated=true)
```

Returns: `MA`

### `location.street`

Generates a random localized street name.

- Canonical: `awd.domain.location.street`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.street call.

```txt
location.street
```

Returns: `Gutmann Creek`

### `location.streetAddress`

Generates a random localized street address.

- Canonical: `awd.domain.location.streetAddress`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `useFullAddress` | `boolean` | no | Whether to expand to a full address including secondary address information. |

Examples:

Shows location.streetAddress when optional params are omitted.

```txt
location.streetAddress()
```

Returns: `7031 Iris Mill`

Shows location.streetAddress using useFullAddress.

```txt
location.streetAddress(useFullAddress=true)
```

Returns: `7031 Iris Mill Apt. 728`

### `location.timeZone`

Returns a random IANA time zone name.

- Canonical: `awd.domain.location.timeZone`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.timeZone call.

```txt
location.timeZone
```

Returns: `America/Santiago`

### `location.zipCode`

Generates data using faker location zip code.

- Canonical: `awd.domain.location.zipCode`
- Faker docs: [https://fakerjs.dev/api/location](https://fakerjs.dev/api/location)

No parameters.

Examples:

Shows the default location.zipCode call.

```txt
location.zipCode
```

Returns: `70310`
