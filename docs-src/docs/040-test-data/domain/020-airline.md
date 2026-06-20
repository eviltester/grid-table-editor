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

Shows the default airline.aircraftType call.

```txt
airline.aircraftType
```

Returns: `regional`

### `airline.airline`

Generate a value using faker airline.airline.

- Canonical: `awd.domain.airline.airline`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airline call.

```txt
airline.airline
```

Returns: `{"name":"Flydubai","iataCode":"FZ"}`

### `airline.airplane`

Generate a value using faker airline.airplane.

- Canonical: `awd.domain.airline.airplane`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airplane call.

```txt
airline.airplane
```

Returns: `{"name":"Boeing 747-400D","iataTypeCode":"74J"}`

### `airline.airport`

Generate a value using faker airline.airport.

- Canonical: `awd.domain.airline.airport`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airport call.

```txt
airline.airport
```

Returns: `{"name":"Hurgada International Airport","iataCode":"HRG"}`

### `airline.flightNumber`

Returns a random flight number. Flight numbers are always 1 to 4 digits long and may include leading zeros.

- Canonical: `awd.domain.airline.flightNumber`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.flightNumber call.

```txt
airline.flightNumber
```

Returns: `70`

### `airline.iataCode`

Generate an airline IATA code.

- Canonical: `awd.domain.airline.airline.iataCode`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airline.iataCode call.

```txt
airline.airline.iataCode
```

Returns: `FZ`

### `airline.name`

Generate an airline name.

- Canonical: `awd.domain.airline.airline.name`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airline.name call.

```txt
airline.airline.name
```

Returns: `Flydubai`

### `airline.recordLocator`

Generates a random record locator. Record locators are 6-character alphanumeric booking references.

- Canonical: `awd.domain.airline.recordLocator`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.recordLocator call.

```txt
airline.recordLocator
```

Returns: `KTAGDC`

### `airline.seat`

Generates a random seat.

- Canonical: `awd.domain.airline.seat`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `aircraftType` | `narrowbody\|regional\|widebody` | no | The aircraft type. Can be one of narrowbody, regional, widebody. |

Examples:

Shows airline.seat in use.

```txt
airline.seat
```

Returns: `15E`

Shows airline.seat in use.

```txt
airline.seat(aircraftType="widebody")
```

Returns: `26H`

Shows airline.seat when optional params are omitted.

```txt
airline.seat()
```

Returns: `15E`

### `airplane.iataTypeCode`

Generate an airplane IATA type code.

- Canonical: `awd.domain.airline.airplane.iataTypeCode`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airplane.iataTypeCode call.

```txt
airline.airplane.iataTypeCode
```

Returns: `74J`

### `airplane.name`

Generate an airplane model name.

- Canonical: `awd.domain.airline.airplane.name`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airplane.name call.

```txt
airline.airplane.name
```

Returns: `Boeing 747-400D`

### `airport.iataCode`

Generate an airport IATA code.

- Canonical: `awd.domain.airline.airport.iataCode`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airport.iataCode call.

```txt
airline.airport.iataCode
```

Returns: `HRG`

### `airport.name`

Generate an airport name.

- Canonical: `awd.domain.airline.airport.name`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airport.name call.

```txt
airline.airport.name
```

Returns: `Hurgada International Airport`
