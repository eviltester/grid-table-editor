---
sidebar_position: 60
title: "commerce Domain"
description: "Domain keyword reference for commerce."
---

# commerce Domain

The `commerce` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

## Methods

### `commerce.department`

Returns a department inside a shop.

- Canonical: `awd.domain.commerce.department`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.department()
```

Example return values:
- `"Sports"`
- `"Clothing"`

### `commerce.isbn`

Returns a random ISBN identifier.

- Canonical: `awd.domain.commerce.isbn`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `separator` | `string` | no | No description provided. |
| `variant` | `string` | no | The variant of the identifier to return. Can be either 10 (10-digit format) or 13 (13-digit format). |

Examples:

```txt
commerce.isbn()
```

```txt
commerce.isbn(separator="-")
```

Example return values:
- `"978-1-02-524697-0"`
- `"978-0-396-76603-2"`

### `commerce.price`

Generates a price between min and max (inclusive).

- Canonical: `awd.domain.commerce.price`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `dec` | `number` | no | The number of decimal places. |
| `max` | `number` | no | The maximum price. |
| `min` | `number` | no | The minimum price. |
| `symbol` | `string` | no | The currency value to use. |

Examples:

```txt
commerce.price()
```

```txt
commerce.price(dec=1)
```

Example return values:
- `"575.79"`
- `"886.65"`

### `commerce.product`

Returns a short product name.

- Canonical: `awd.domain.commerce.product`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.product()
```

Example return values:
- `"Salad"`
- `"Chair"`

### `commerce.productAdjective`

Returns an adjective describing a product.

- Canonical: `awd.domain.commerce.productAdjective`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.productAdjective()
```

Example return values:
- `"Intelligent"`
- `"Rustic"`

### `commerce.productDescription`

Returns a product description.

- Canonical: `awd.domain.commerce.productDescription`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.productDescription()
```

Example return values:
- `"Our hamster-friendly Shoes ensures triangular comfort for your pets"`
- `"Savor the crispy essence in our Towels, designed for pushy culinary adventures"`

### `commerce.productMaterial`

Returns a material of a product.

- Canonical: `awd.domain.commerce.productMaterial`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.productMaterial()
```

Example return values:
- `"Aluminum"`
- `"Plastic"`

### `commerce.productName`

Generates a random descriptive product name.

- Canonical: `awd.domain.commerce.productName`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.productName()
```

Example return values:
- `"Soft Cotton Soap"`
- `"Electronic Wooden Pizza"`
