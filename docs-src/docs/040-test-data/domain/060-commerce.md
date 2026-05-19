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
- `"Industrial"`
- `"Baby"`

### `commerce.isbn`

Returns a random ISBN identifier.

- Canonical: `awd.domain.commerce.isbn`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `separator` | `string` | no | Character inserted between ISBN groups (for example `-`). |
| `variant` | `string` | no | ISBN length variant: use `"10"` for ISBN-10 or `"13"` for ISBN-13. |

Examples:

```txt
commerce.isbn()
```

```txt
commerce.isbn(separator="-", variant="13")
```

Example return values:
- `"978-1-74663-962-4"`
- `"978-1-158-06239-3"`

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
- `"348.35"`
- `"818.69"`

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
- `"Pants"`

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
- `"Modern"`
- `"Tasty"`

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
- `"Roob - Wehner's most advanced Tuna technology increases concrete capabilities"`
- `"Stylish Car designed to make you stand out with impossible looks"`

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
- `"Bamboo"`
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
- `"Soft Gold Shoes"`
- `"Recycled Concrete Bike"`
