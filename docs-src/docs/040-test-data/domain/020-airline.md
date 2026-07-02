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

### `airline.flightNumber`

Returns a random flight number. Flight numbers are always 1 to 4 digits long and may include leading zeros.

- Canonical: `awd.domain.airline.flightNumber`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired flight-number length. |
| `addLeadingZeros` | `boolean` | no | Whether shorter flight numbers should be padded with leading zeros. |

Examples:

Shows the default airline.flightNumber call.

```txt
airline.flightNumber()
```

Returns: `70`

Shows airline.flightNumber using length and leading-zero options.

```txt
airline.flightNumber(length=4, addLeadingZeros=true)
```

Returns: `4703`

Shows airline.flightNumber using a fixed length.

```txt
airline.flightNumber(length=4)
```

Returns: `4703`

Shows airline.flightNumber padding shorter values with leading zeros.

```txt
airline.flightNumber(addLeadingZeros=true)
```

Returns: `0070`

### `airline.iataCode`

Generate an airline IATA code.

- Canonical: `awd.domain.airline.airline.iataCode`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

No parameters.

Examples:

Shows the default airline.airline.iataCode call.

```txt
airline.iataCode
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
airline.name
```

Returns: `Flydubai`

### `airline.recordLocator`

Generates a random record locator. Record locators are 6-character alphanumeric booking references.

- Canonical: `awd.domain.airline.recordLocator`
- Faker docs: [https://fakerjs.dev/api/airline](https://fakerjs.dev/api/airline)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `allowNumerics` | `boolean` | no | Whether numeric characters can be included. |
| `allowVisuallySimilarCharacters` | `boolean` | no | Whether visually similar characters such as I, 1, O, and 0 can be included. |

Examples:

Shows the default airline.recordLocator call.

```txt
airline.recordLocator()
```

Returns: `KTAGDC`

Shows airline.recordLocator allowing numeric characters.

```txt
airline.recordLocator(allowNumerics=true)
```

Returns: `ER2B64`

Shows airline.recordLocator allowing visually similar characters.

```txt
airline.recordLocator(allowVisuallySimilarCharacters=true)
```

Returns: `KSAHDC`

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
airplane.iataTypeCode
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
airplane.name
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
airport.iataCode
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
airport.name
```

Returns: `Hurgada International Airport`
