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
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.bio
```

Example return values:
- `person, activist, entrepreneur ✌🏿`

### `person.firstName`

Returns a random first name.

- Canonical: `awd.domain.person.firstName`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `female\|male` | no | Optional sex for first-name selection. Valid values: female or male. |

Examples:

```txt
person.firstName()
```

```txt
person.firstName(sex="female")
```

Example return values:
- `Aaliyah`
- `Monique`

### `person.fullName`

Generates a random full name.

- Canonical: `awd.domain.person.fullName`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.fullName
```

Example return values:
- `Aaliyah Corkery`

### `person.gender`

Returns a random gender.

- Canonical: `awd.domain.person.gender`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.gender
```

Example return values:
- `Genderflux`

### `person.jobArea`

Generates a random job area.

- Canonical: `awd.domain.person.jobArea`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.jobArea
```

Example return values:
- `Group`

### `person.jobDescriptor`

Generates a random job descriptor.

- Canonical: `awd.domain.person.jobDescriptor`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.jobDescriptor
```

Example return values:
- `Regional`

### `person.jobTitle`

Generates a random job title.

- Canonical: `awd.domain.person.jobTitle`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.jobTitle
```

Example return values:
- `Regional Assurance Supervisor`

### `person.jobType`

Generates a random job type.

- Canonical: `awd.domain.person.jobType`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.jobType
```

Example return values:
- `Administrator`

### `person.lastName`

Returns a random last name.

- Canonical: `awd.domain.person.lastName`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `female\|male` | no | Optional sex for last-name selection. Valid values: female or male. |

Examples:

```txt
person.lastName()
```

```txt
person.lastName(sex="female")
```

Example return values:
- `Abbott`
- `Reichel`

### `person.middleName`

Returns a random middle name.

- Canonical: `awd.domain.person.middleName`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `female\|male` | no | Optional sex for middle-name selection. Valid values: female or male. |

Examples:

```txt
person.middleName()
```

```txt
person.middleName(sex="female")
```

Example return values:
- `Abigail`
- `Morgan`

### `person.prefix`

Returns a random person prefix.

- Canonical: `awd.domain.person.prefix`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `female\|male` | no | The optional sex to use. Can be either 'female' or 'male'. |

Examples:

```txt
person.prefix()
```

```txt
person.prefix(sex="female")
```

Example return values:
- `Miss`
- `Ms.`

### `person.sex`

Returns a random sex.

- Canonical: `awd.domain.person.sex`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.sex
```

Example return values:
- `female`

### `person.sexType`

Returns a random sex type. The `SexType` is intended to be used in parameters and conditions.

- Canonical: `awd.domain.person.sexType`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.sexType
```

Example return values:
- `female`

### `person.suffix`

Returns a random person suffix.

- Canonical: `awd.domain.person.suffix`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.suffix
```

Example return values:
- `III`

### `person.zodiacSign`

Returns a random zodiac sign.

- Canonical: `awd.domain.person.zodiacSign`
- Docs: [https://anywaydata.com/docs/test-data/domain/person](https://anywaydata.com/docs/test-data/domain/person)
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

```txt
person.zodiacSign
```

Example return values:
- `Cancer`
