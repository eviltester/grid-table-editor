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
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.aircraftType
```

Example return values:
- `regional`

### `airline.airline`

Generate a value using faker airline.airline.

- Canonical: `awd.domain.airline.airline`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airline
```

Example return values:
- `{"name":"Flydubai","iataCode":"FZ"}`

### `airline.airline.iataCode`

Generate an airline IATA code.

- Canonical: `awd.domain.airline.airline.iataCode`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airline.iataCode
```

Example return values:
- `FZ`

### `airline.airline.name`

Generate an airline name.

- Canonical: `awd.domain.airline.airline.name`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airline.name
```

Example return values:
- `Flydubai`

### `airline.airplane`

Generate a value using faker airline.airplane.

- Canonical: `awd.domain.airline.airplane`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airplane
```

Example return values:
- `{"name":"Boeing 747-400D","iataTypeCode":"74J"}`

### `airline.airplane.iataTypeCode`

Generate an airplane IATA type code.

- Canonical: `awd.domain.airline.airplane.iataTypeCode`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airplane.iataTypeCode
```

Example return values:
- `74J`

### `airline.airplane.name`

Generate an airplane model name.

- Canonical: `awd.domain.airline.airplane.name`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airplane.name
```

Example return values:
- `Boeing 747-400D`

### `airline.airport`

Generate a value using faker airline.airport.

- Canonical: `awd.domain.airline.airport`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airport
```

Example return values:
- `{"name":"Hurgada International Airport","iataCode":"HRG"}`

### `airline.airport.iataCode`

Generate an airport IATA code.

- Canonical: `awd.domain.airline.airport.iataCode`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airport.iataCode
```

Example return values:
- `HRG`

### `airline.airport.name`

Generate an airport name.

- Canonical: `awd.domain.airline.airport.name`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.airport.name
```

Example return values:
- `Hurgada International Airport`

### `airline.flightNumber`

Returns a random flight number. Flight numbers are always 1 to 4 digits long and may include leading zeros.

- Canonical: `awd.domain.airline.flightNumber`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.flightNumber
```

Example return values:
- `70`

### `airline.recordLocator`

Generates a random record locator. Record locators are 6-character alphanumeric booking references.

- Canonical: `awd.domain.airline.recordLocator`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.recordLocator
```

Example return values:
- `KTAGDC`

### `airline.seat`

Generates a random seat.

- Canonical: `awd.domain.airline.seat`
- Docs: [https://anywaydata.com/docs/test-data/domain/airline](https://anywaydata.com/docs/test-data/domain/airline)
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `aircraftType` | `narrowbody\|regional\|widebody` | no | The aircraft type. Can be one of narrowbody, regional, widebody. |

Examples:

```txt
airline.seat
```

```txt
airline.seat(aircraftType="widebody")
```

```txt
airline.seat()
```

Example return values:
- `15E`
- `26H`
- `15E`
