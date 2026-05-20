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
- `regional`

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
- `{"name":"American Airlines","iataCode":"AA"}`

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
- `AA`

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
- `Acme Air`

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
- `{"name":"Airbus A320","iataTypeCode":"A320"}`

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
- `A320`

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
- `Boeing 737`

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
- `{"name":"Heathrow Airport","iataCode":"LHR"}`

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
- `LHR`

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
- `London Heathrow Airport`

### `airline.flightNumber`

Returns a random flight number. Flight numbers are always 1 to 4 digits long and may include leading zeros.

- Canonical: `awd.domain.airline.flightNumber`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.flightNumber()
```

Example return values:
- `1`

### `airline.recordLocator`

Generates a random record locator. Record locators are 6-character alphanumeric booking references.

- Canonical: `awd.domain.airline.recordLocator`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

```txt
airline.recordLocator()
```

Example return values:
- `TCSJCN`

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
- `17F`
