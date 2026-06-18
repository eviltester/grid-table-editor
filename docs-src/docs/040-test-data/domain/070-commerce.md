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
- Docs: [https://anywaydata.com/docs/test-data/domain/commerce](https://anywaydata.com/docs/test-data/domain/commerce)
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.department
```

Example return values:
- `Grocery`

### `commerce.isbn`

Returns a random ISBN identifier.

- Canonical: `awd.domain.commerce.isbn`
- Docs: [https://anywaydata.com/docs/test-data/domain/commerce](https://anywaydata.com/docs/test-data/domain/commerce)
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `separator` | `string` | no | Separator inserted between generated items. |
| `variant` | `10\|13` | no | ISBN length variant: use 10 for ISBN-10 or 13 for ISBN-13. |

Examples:

```txt
commerce.isbn()
```

```txt
commerce.isbn(separator="-")
```

```txt
commerce.isbn(variant=10)
```

Example return values:
- `978-0-7031-0133-4`
- `978-0-7031-0133-4`
- `0-7031-0133-1`

### `commerce.price`

Generates a price between min and max (inclusive).

- Canonical: `awd.domain.commerce.price`
- Docs: [https://anywaydata.com/docs/test-data/domain/commerce](https://anywaydata.com/docs/test-data/domain/commerce)
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `dec` | `integer` | no | The number of decimal places. |
| `max` | `number` | no | The maximum price. |
| `min` | `number` | no | The minimum price. |
| `symbol` | `string` | no | The currency value to use. |

Examples:

```txt
commerce.price(dec=2, max=10, min=1, symbol="$")
```

```txt
commerce.price()
```

```txt
commerce.price(dec=2)
```

```txt
commerce.price(max=100)
```

```txt
commerce.price(max=10, min=1)
```

```txt
commerce.price(symbol="$")
```

Example return values:
- `$4.79`
- `417.69`
- `417.69`
- `42.29`
- `4.79`
- `$417.69`

### `commerce.product`

Returns a short product name.

- Canonical: `awd.domain.commerce.product`
- Docs: [https://anywaydata.com/docs/test-data/domain/commerce](https://anywaydata.com/docs/test-data/domain/commerce)
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.product
```

Example return values:
- `Gloves`

### `commerce.productAdjective`

Returns an adjective describing a product.

- Canonical: `awd.domain.commerce.productAdjective`
- Docs: [https://anywaydata.com/docs/test-data/domain/commerce](https://anywaydata.com/docs/test-data/domain/commerce)
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.productAdjective
```

Example return values:
- `Handmade`

### `commerce.productDescription`

Returns a product description.

- Canonical: `awd.domain.commerce.productDescription`
- Docs: [https://anywaydata.com/docs/test-data/domain/commerce](https://anywaydata.com/docs/test-data/domain/commerce)
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.productDescription
```

Example return values:
- `New Sausages model with 1 GB RAM, 303 GB storage, and bruised features`

### `commerce.productMaterial`

Returns a material of a product.

- Canonical: `awd.domain.commerce.productMaterial`
- Docs: [https://anywaydata.com/docs/test-data/domain/commerce](https://anywaydata.com/docs/test-data/domain/commerce)
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.productMaterial
```

Example return values:
- `Gold`

### `commerce.productName`

Generates a random descriptive product name.

- Canonical: `awd.domain.commerce.productName`
- Docs: [https://anywaydata.com/docs/test-data/domain/commerce](https://anywaydata.com/docs/test-data/domain/commerce)
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

No parameters.

Examples:

```txt
commerce.productName
```

Example return values:
- `Handmade Plastic Bacon`

### `commerce.upc`

Returns a valid UPC-A (12 digits).

- Canonical: `awd.domain.commerce.upc`
- Docs: [https://anywaydata.com/docs/test-data/domain/commerce](https://anywaydata.com/docs/test-data/domain/commerce)
- Faker docs: [https://fakerjs.dev/api/commerce](https://fakerjs.dev/api/commerce)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `prefix` | `string` | no | Optional numeric prefix for the UPC body (0-11 digits). |

Examples:

```txt
commerce.upc()
```

```txt
commerce.upc(prefix="01234")
```

Example return values:
- `470310133543`
- `012344703103`
