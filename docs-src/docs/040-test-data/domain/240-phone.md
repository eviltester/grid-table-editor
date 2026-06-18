---
sidebar_position: 240
title: "phone Domain"
description: "Domain keyword reference for phone."
---

# phone Domain

The `phone` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/phone](https://fakerjs.dev/api/phone)

## Methods

### `phone.imei`

Generates IMEI number.

- Canonical: `awd.domain.phone.imei`
- Docs: [https://anywaydata.com/docs/test-data/domain/phone](https://anywaydata.com/docs/test-data/domain/phone)
- Faker docs: [https://fakerjs.dev/api/phone](https://fakerjs.dev/api/phone)

No parameters.

Examples:

```txt
phone.imei
```

Example return values:
- `47-031013-354628-7`

### `phone.number`

Generates a random phone number.

- Canonical: `awd.domain.phone.number`
- Docs: [https://anywaydata.com/docs/test-data/domain/phone](https://anywaydata.com/docs/test-data/domain/phone)
- Faker docs: [https://fakerjs.dev/api/phone](https://fakerjs.dev/api/phone)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `style` | `human\|national\|international` | no | Style of the generated phone number: 'human': (default) A human-input phone number, e.g. 555-770-7727 or 555.770.7727 x1234 'national': A phone number in a standardized national format, e.g. (555) 123-4567. 'international': A phone number in the E.123 international format, e.g. +15551234567 |

Examples:

```txt
phone.number()
```

```txt
phone.number(style="international")
```

Example return values:
- `1-703-301-3354 x628`
- `+15704101335`
