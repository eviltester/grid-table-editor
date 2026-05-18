---
sidebar_position: 230
title: "person Domain"
description: "Domain keyword reference for person."
---

# person Domain

The `person` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

## Methods

### `person.bio`

Returns a random short biography

- Canonical: `awd.domain.person.bio`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.bio()
```

Example return values:
- `"detective devotee  🗽"`
- `"author"`

### `person.firstName`

Returns a random first name.

- Canonical: `awd.domain.person.firstName`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `string` | no | The optional sex to use for first-name selection. |

Examples:

```txt
person.firstName()
```

```txt
person.firstName(sex="sample")
```

Example return values:
- `"Amparo"`
- `"Verla"`

### `person.fullName`

Generates a random full name.

- Canonical: `awd.domain.person.fullName`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.fullName()
```

Example return values:
- `"Homer Lesch"`
- `"Arnold Torphy"`

### `person.gender`

Returns a random gender.

- Canonical: `awd.domain.person.gender`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.gender()
```

Example return values:
- `"Trigender"`
- `"T* woman"`

### `person.jobArea`

Generates a random job area.

- Canonical: `awd.domain.person.jobArea`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.jobArea()
```

Example return values:
- `"Accounts"`
- `"Factors"`

### `person.jobDescriptor`

Generates a random job descriptor.

- Canonical: `awd.domain.person.jobDescriptor`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.jobDescriptor()
```

Example return values:
- `"Internal"`
- `"Product"`

### `person.jobTitle`

Generates a random job title.

- Canonical: `awd.domain.person.jobTitle`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.jobTitle()
```

Example return values:
- `"Human Security Coordinator"`
- `"Future Branding Coordinator"`

### `person.jobType`

Generates a random job type.

- Canonical: `awd.domain.person.jobType`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.jobType()
```

Example return values:
- `"Coordinator"`
- `"Coordinator"`

### `person.lastName`

Returns a random last name.

- Canonical: `awd.domain.person.lastName`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `string` | no | The optional sex to use for last-name selection. |

Examples:

```txt
person.lastName()
```

```txt
person.lastName(sex="sample")
```

Example return values:
- `"Blick-Cormier"`
- `"Treutel"`

### `person.middleName`

Returns a random middle name.

- Canonical: `awd.domain.person.middleName`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `string` | no | The optional sex to use for middle-name selection. |

Examples:

```txt
person.middleName()
```

```txt
person.middleName(sex="sample")
```

Example return values:
- `"Jamie"`
- `"Ellis"`

### `person.prefix`

Returns a random person prefix.

- Canonical: `awd.domain.person.prefix`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `string` | no | The optional sex to use. Can be either 'female' or 'male'. |

Examples:

```txt
person.prefix()
```

```txt
person.prefix(sex="sample")
```

Example return values:
- `"Ms."`
- `"Miss"`

### `person.sex`

Returns a random sex.

- Canonical: `awd.domain.person.sex`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.sex()
```

Example return values:
- `"male"`
- `"female"`

### `person.sexType`

Returns a random sex type. The `SexType` is intended to be used in parameters and conditions.

- Canonical: `awd.domain.person.sexType`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.sexType()
```

Example return values:
- `"male"`
- `"male"`

### `person.suffix`

Returns a random person suffix.

- Canonical: `awd.domain.person.suffix`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.suffix()
```

Example return values:
- `"IV"`
- `"Jr."`

### `person.zodiacSign`

Returns a random zodiac sign.

- Canonical: `awd.domain.person.zodiacSign`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.zodiacSign()
```

Example return values:
- `"Taurus"`
- `"Leo"`
