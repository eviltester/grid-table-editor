---
sidebar_position: 70
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

Shows the default commerce.department call.

```txt
commerce.department
```

Returns: `Grocery`

### `commerce.isbn`

Returns a random ISBN identifier.

- Canonical: `awd.domain.commerce.isbn`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `separator` | `string` | no | Separator inserted between generated items. |
| `variant` | `10\|13` | no | ISBN length variant: use 10 for ISBN-10 or 13 for ISBN-13. |

Examples:

Shows commerce.isbn when optional params are omitted.

```txt
commerce.isbn()
```

Returns: `978-0-7031-0133-4`

Shows commerce.isbn using separator.

```txt
commerce.isbn(separator="-")
```

Returns: `978-0-7031-0133-4`

Shows commerce.isbn using variant.

```txt
commerce.isbn(variant=10)
```

Returns: `0-7031-0133-1`

### `commerce.price`

Generates a price between min and max (inclusive).

- Canonical: `awd.domain.commerce.price`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `dec` | `integer` | no | The number of decimal places. |
| `max` | `number` | no | The maximum price. |
| `min` | `number` | no | The minimum price. |
| `symbol` | `string` | no | The currency value to use. |

Examples:

Shows commerce.price in use.

```txt
commerce.price(dec=2, max=10, min=1, symbol="$")
```

Returns: `$4.79`

Shows commerce.price when optional params are omitted.

```txt
commerce.price()
```

Returns: `417.69`

Shows commerce.price using dec.

```txt
commerce.price(dec=2)
```

Returns: `417.69`

Shows commerce.price using max.

```txt
commerce.price(max=100)
```

Returns: `42.29`

Shows commerce.price using min.

```txt
commerce.price(max=10, min=1)
```

Returns: `4.79`

Shows commerce.price using symbol.

```txt
commerce.price(symbol="$")
```

Returns: `$417.69`

### `commerce.product`

Returns a short product name.

- Canonical: `awd.domain.commerce.product`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

Shows the default commerce.product call.

```txt
commerce.product
```

Returns: `Gloves`

### `commerce.productAdjective`

Returns an adjective describing a product.

- Canonical: `awd.domain.commerce.productAdjective`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

Shows the default commerce.productAdjective call.

```txt
commerce.productAdjective
```

Returns: `Handmade`

### `commerce.productDescription`

Returns a product description.

- Canonical: `awd.domain.commerce.productDescription`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

Shows the default commerce.productDescription call.

```txt
commerce.productDescription
```

Returns: `New Sausages model with 1 GB RAM, 303 GB storage, and bruised features`

### `commerce.productMaterial`

Returns a material of a product.

- Canonical: `awd.domain.commerce.productMaterial`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

Shows the default commerce.productMaterial call.

```txt
commerce.productMaterial
```

Returns: `Gold`

### `commerce.productName`

Generates a random descriptive product name.

- Canonical: `awd.domain.commerce.productName`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

Shows the default commerce.productName call.

```txt
commerce.productName
```

Returns: `Handmade Plastic Bacon`

### `commerce.upc`

Returns a valid UPC-A (12 digits).

- Canonical: `awd.domain.commerce.upc`
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `prefix` | `string` | no | Optional numeric prefix for the UPC body (0-11 digits). |

Examples:

Shows commerce.upc when optional params are omitted.

```txt
commerce.upc()
```

Returns: `470310133543`

Shows commerce.upc using prefix.

```txt
commerce.upc(prefix="01234")
```

Returns: `012344703103`
