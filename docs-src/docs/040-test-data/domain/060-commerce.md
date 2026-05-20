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
- `Tools`

### `commerce.isbn`

Returns a random ISBN identifier.

- Canonical: `awd.domain.commerce.isbn`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `separator` | `string` | no | Separator inserted between generated items. |
| `variant` | `string` | no | ISBN length variant: use "10" for ISBN-10 or "13" for ISBN-13. |

Examples:

```txt
commerce.isbn()
```

```txt
commerce.isbn(separator="-", variant="13")
```

Example return values:
- `978-1-996134-54-2`

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
commerce.price(dec=1, max=1, min=1, symbol="$")
```

Example return values:
- `797.39`

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
- `Bike`

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
- `Luxurious`

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
- `The green Hat combines Colombia aesthetics with Scandium-based durability`

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
- `Steel`

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
- `Soft Bronze Towels`
