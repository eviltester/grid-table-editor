---
sidebar_position: 20
title: "airline Domain"
description: "Domain keyword reference for airline."
---

# airline Domain

The `airline` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

## Methods

### `airline.aircraftType`

Returns a random aircraft type.

- Canonical: `awd.domain.airline.aircraftType`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.aircraftType()
```

Example return values:
- `"widebody"`
- `"regional"`

### `airline.airline`

Generate a value using faker airline.airline.

- Canonical: `awd.domain.airline.airline`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airline()
```

Example return values:
- `{"name":"Air Mauritius","iataCode":"MK"}`
- `{"name":"China Southern Airlines","iataCode":"CZ"}`

### `airline.airline.iataCode`

Generate an airline IATA code.

- Canonical: `awd.domain.airline.airline.iataCode`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airline.iataCode()
```

Example return values:
- `"JT"`
- `"W6"`

### `airline.airline.name`

Generate an airline name.

- Canonical: `awd.domain.airline.airline.name`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airline.name()
```

Example return values:
- `"SriLankan Airlines"`
- `"Spring Airlines"`

### `airline.airplane`

Generate a value using faker airline.airplane.

- Canonical: `awd.domain.airline.airplane`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airplane()
```

Example return values:
- `{"name":"Airbus A340-300","iataTypeCode":"343"}`
- `{"name":"Airbus A330","iataTypeCode":"330"}`

### `airline.airplane.iataTypeCode`

Generate an airplane IATA type code.

- Canonical: `awd.domain.airline.airplane.iataTypeCode`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airplane.iataTypeCode()
```

Example return values:
- `"346"`
- `"773"`

### `airline.airplane.name`

Generate an airplane model name.

- Canonical: `awd.domain.airline.airplane.name`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airplane.name()
```

Example return values:
- `"De Havilland Canada DHC-3 Otter"`
- `"Airbus A319"`

### `airline.airport`

Generate a value using faker airline.airport.

- Canonical: `awd.domain.airline.airport`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airport()
```

Example return values:
- `{"name":"Cairns Airport","iataCode":"CNS"}`
- `{"name":"Toronto Pearson International Airport","iataCode":"YYZ"}`

### `airline.airport.iataCode`

Generate an airport IATA code.

- Canonical: `awd.domain.airline.airport.iataCode`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airport.iataCode()
```

Example return values:
- `"FOR"`
- `"DME"`

### `airline.airport.name`

Generate an airport name.

- Canonical: `awd.domain.airline.airport.name`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airport.name()
```

Example return values:
- `"Zhukovsky International Airport"`
- `"Salgado Filho International Airport"`

### `airline.flightNumber`

Returns a random flight number. Flight numbers are always 1 to 4 digits long. Sometimes they are

- Canonical: `awd.domain.airline.flightNumber`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.flightNumber()
```

Example return values:
- `"97"`
- `"490"`

### `airline.recordLocator`

Generates a random record locator. Record locators

- Canonical: `awd.domain.airline.recordLocator`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.recordLocator()
```

Example return values:
- `"NKTNNS"`
- `"AAHMGG"`

### `airline.seat`

Generates a random seat.

- Canonical: `awd.domain.airline.seat`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `aircraftType` | `string` | no | The aircraft type. Can be one of narrowbody, regional, widebody. |

Examples:

```txt
airline.seat()
```

```txt
airline.seat(aircraftType="narrowbody")
```

Example return values:
- `"31E"`
- `"21F"`
