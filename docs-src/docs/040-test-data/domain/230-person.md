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

Shows the default person.bio call.

```txt
person.bio
```

Returns: `person, activist, entrepreneur ✌🏿`

### `person.firstName`

Returns a random first name.

- Canonical: `awd.domain.person.firstName`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `female\|male` | no | Optional sex for first-name selection. Valid values: female or male. |

Examples:

Shows person.firstName when optional params are omitted.

```txt
person.firstName()
```

Returns: `Aaliyah`

Shows person.firstName using sex.

```txt
person.firstName(sex="female")
```

Returns: `Monique`

### `person.fullName`

Generates a random full name.

- Canonical: `awd.domain.person.fullName`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `firstName` | `string` | no | Optional first name to use as the basis for the full name. |
| `lastName` | `string` | no | Optional last name to use as the basis for the full name. |
| `sex` | `female\|generic\|male` | no | Sex category used for the generated full name. |

Examples:

Shows the default person.fullName call.

```txt
person.fullName()
```

Returns: `Aaliyah Corkery`

Shows person.fullName using name and sex options.

```txt
person.fullName(firstName="Ada", lastName="Lovelace", sex="female")
```

Returns: `Ada Lovelace`

Shows person.fullName using an explicit first name.

```txt
person.fullName(firstName="Ada")
```

Returns: `Ada Abbott`

Shows person.fullName using an explicit last name.

```txt
person.fullName(lastName="Lovelace")
```

Returns: `Aaliyah Lovelace`

Shows person.fullName using a sex category.

```txt
person.fullName(sex="female")
```

Returns: `Monique Gutmann`

### `person.gender`

Returns a random gender.

- Canonical: `awd.domain.person.gender`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

Shows the default person.gender call.

```txt
person.gender
```

Returns: `Genderflux`

### `person.jobArea`

Generates a random job area.

- Canonical: `awd.domain.person.jobArea`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

Shows the default person.jobArea call.

```txt
person.jobArea
```

Returns: `Group`

### `person.jobDescriptor`

Generates a random job descriptor.

- Canonical: `awd.domain.person.jobDescriptor`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

Shows the default person.jobDescriptor call.

```txt
person.jobDescriptor
```

Returns: `Regional`

### `person.jobTitle`

Generates a random job title.

- Canonical: `awd.domain.person.jobTitle`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

Shows the default person.jobTitle call.

```txt
person.jobTitle
```

Returns: `Regional Assurance Supervisor`

### `person.jobType`

Generates a random job type.

- Canonical: `awd.domain.person.jobType`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

Shows the default person.jobType call.

```txt
person.jobType
```

Returns: `Administrator`

### `person.lastName`

Returns a random last name.

- Canonical: `awd.domain.person.lastName`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `female\|male` | no | Optional sex for last-name selection. Valid values: female or male. |

Examples:

Shows person.lastName when optional params are omitted.

```txt
person.lastName()
```

Returns: `Abbott`

Shows person.lastName using sex.

```txt
person.lastName(sex="female")
```

Returns: `Reichel`

### `person.middleName`

Returns a random middle name.

- Canonical: `awd.domain.person.middleName`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `female\|male` | no | Optional sex for middle-name selection. Valid values: female or male. |

Examples:

Shows person.middleName when optional params are omitted.

```txt
person.middleName()
```

Returns: `Abigail`

Shows person.middleName using sex.

```txt
person.middleName(sex="female")
```

Returns: `Morgan`

### `person.prefix`

Returns a random person prefix.

- Canonical: `awd.domain.person.prefix`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `female\|male` | no | The optional sex to use. Can be either 'female' or 'male'. |

Examples:

Shows person.prefix when optional params are omitted.

```txt
person.prefix()
```

Returns: `Miss`

Shows person.prefix using sex.

```txt
person.prefix(sex="female")
```

Returns: `Ms.`

### `person.sex`

Returns a random sex.

- Canonical: `awd.domain.person.sex`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

Shows the default person.sex call.

```txt
person.sex
```

Returns: `female`

### `person.sexType`

Returns a random sex type. The `SexType` is intended to be used in parameters and conditions.

- Canonical: `awd.domain.person.sexType`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `includeGeneric` | `boolean` | no | Whether the generic sex type can be returned. |

Examples:

Shows the default person.sexType call.

```txt
person.sexType()
```

Returns: `female`

Shows person.sexType excluding the generic value.

```txt
person.sexType(includeGeneric=false)
```

Returns: `female`

### `person.suffix`

Returns a random person suffix.

- Canonical: `awd.domain.person.suffix`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

Shows the default person.suffix call.

```txt
person.suffix
```

Returns: `III`

### `person.zodiacSign`

Returns a random zodiac sign.

- Canonical: `awd.domain.person.zodiacSign`
- Faker docs: [https://fakerjs.dev/api/person](https://fakerjs.dev/api/person)

No parameters.

Examples:

Shows the default person.zodiacSign call.

```txt
person.zodiacSign
```

Returns: `Cancer`
