---
sidebar_position: 110
title: "finance Domain"
description: "Domain keyword reference for finance."
---

# finance Domain

The `finance` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

## Methods

### `finance.accountName`

Generates a random account name.

- Canonical: `awd.domain.finance.accountName`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.accountName()
```

Example return values:
- `"Auto Loan Account"`
- `"Credit Card Account"`

### `finance.accountNumber`

Generates a random account number.

- Canonical: `awd.domain.finance.accountNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | No description provided. |

Examples:

```txt
finance.accountNumber()
```

```txt
finance.accountNumber(length=1)
```

Example return values:
- `"88291458"`
- `"72117813"`

### `finance.amount`

Generates a random amount between the given bounds (inclusive).

- Canonical: `awd.domain.finance.amount`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `autoFormat` | `boolean` | no | If true this method will use Number.toLocaleString(). Otherwise it will use Number.toFixed(). |
| `dec` | `number` | no | The number of decimal places for the amount. |
| `max` | `number` | no | The upper bound for the amount. |
| `min` | `number` | no | The lower bound for the amount. |
| `symbol` | `string` | no | The symbol used to prefix the amount. |

Examples:

```txt
finance.amount()
```

```txt
finance.amount(autoFormat=true, dec=1, max=1, min=1, symbol="$")
```

Example return values:
- `"860.56"`
- `"230.37"`

### `finance.bic`

Generates a random SWIFT/BIC code based on the ISO-9362 format.

- Canonical: `awd.domain.finance.bic`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `includeBranchCode` | `boolean` | no | Whether to include a three-digit branch code at the end of the generated code. |

Examples:

```txt
finance.bic()
```

```txt
finance.bic(includeBranchCode=true)
```

Example return values:
- `"PPTHVNHP"`
- `"ZDMNGD1B"`

### `finance.bitcoinAddress`

Generates a random Bitcoin address.

- Canonical: `awd.domain.finance.bitcoinAddress`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.bitcoinAddress()
```

Example return values:
- `"3x8wqMpoemq3ybv1yWn1AjW4NW"`
- `"bc1a3pk2fkzvf5c9v2fvjd8yjmggeg2t6e9uletx3g"`

### `finance.creditCardCVV`

Generates a random credit card CVV.

- Canonical: `awd.domain.finance.creditCardCVV`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.creditCardCVV()
```

Example return values:
- `"486"`
- `"990"`

### `finance.creditCardIssuer`

Returns a random credit card issuer.

- Canonical: `awd.domain.finance.creditCardIssuer`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.creditCardIssuer()
```

Example return values:
- `"american_express"`
- `"diners_club"`

### `finance.creditCardNumber`

Generates a random credit card number.

- Canonical: `awd.domain.finance.creditCardNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `issuer` | `string` | no | No description provided. |

Examples:

```txt
finance.creditCardNumber()
```

```txt
finance.creditCardNumber(issuer="sample")
```

Example return values:
- `"6570-3453-3447-4166"`
- `"5368-2893-3140-6714"`

### `finance.currency`

Returns a random currency object, containing `code`, `name`, `symbol`, and `numericCode` properties.

- Canonical: `awd.domain.finance.currency`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currency()
```

Example return values:
- `{"name":"Dong","code":"VND","symbol":"₫","numericCode":"704"}`
- `{"name":"Gibraltar Pound","code":"GIP","symbol":"£","numericCode":"292"}`

### `finance.currencyCode`

Returns a random currency code.

- Canonical: `awd.domain.finance.currencyCode`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currencyCode()
```

Example return values:
- `"NOK"`
- `"DJF"`

### `finance.currencyName`

Returns a random currency name.

- Canonical: `awd.domain.finance.currencyName`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currencyName()
```

Example return values:
- `"South Sudanese pound"`
- `"CFP Franc"`

### `finance.currencyNumericCode`

Returns a random currency numeric code.

- Canonical: `awd.domain.finance.currencyNumericCode`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currencyNumericCode()
```

Example return values:
- `"417"`
- `"324"`

### `finance.currencySymbol`

Returns a random currency symbol.

- Canonical: `awd.domain.finance.currencySymbol`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currencySymbol()
```

Example return values:
- `"Ft"`
- `"руб"`

### `finance.ethereumAddress`

Creates a random, non-checksum Ethereum address.

- Canonical: `awd.domain.finance.ethereumAddress`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.ethereumAddress()
```

Example return values:
- `"0xeedc5f2fa15afedea5e6ab4cae745db0670d2edc"`
- `"0xfc6a2707be50b391a0ce249f320e887f3bad4bab"`

### `finance.iban`

Generates a random IBAN.

- Canonical: `awd.domain.finance.iban`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `countryCode` | `string` | no | The country code from which you want to generate an IBAN, if none is provided a random country will be used. |
| `formatted` | `boolean` | no | Return a formatted version of the generated IBAN. |

Examples:

```txt
finance.iban()
```

```txt
finance.iban(countryCode="GB", formatted=true)
```

Example return values:
- `"CZ9000876680090097910782"`
- `"AD3250001002325310563544"`

### `finance.litecoinAddress`

Generates a random Litecoin address.

- Canonical: `awd.domain.finance.litecoinAddress`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.litecoinAddress()
```

Example return values:
- `"3gZosYYk6RvfzNyBzC8ydnSCRWSf"`
- `"L4nhEA39vgMdmTtc5p83G7Sydn"`

### `finance.maskedNumber`

Generates a random masked number.

- Canonical: `awd.domain.finance.maskedNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | No description provided. |

Examples:

```txt
finance.maskedNumber()
```

```txt
finance.maskedNumber(length=1)
```

Example return values:
- `"(...2487)"`
- `"(...8204)"`

### `finance.pin`

Generates a random PIN number.

- Canonical: `awd.domain.finance.pin`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | No description provided. |

Examples:

```txt
finance.pin()
```

```txt
finance.pin(length=1)
```

Example return values:
- `"2272"`
- `"6321"`

### `finance.routingNumber`

Generates a random routing number.

- Canonical: `awd.domain.finance.routingNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.routingNumber()
```

Example return values:
- `"159195743"`
- `"549016924"`

### `finance.transactionDescription`

Generates a random transaction description.

- Canonical: `awd.domain.finance.transactionDescription`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.transactionDescription()
```

Example return values:
- `"Payment of VES 758.35 for deposit at Towne, Haley and Yost, processed with card ending ****1184 linked to account ***9937."`
- `"A invoice of NIO 619.11 occurred at O'Conner Group using a card ending in ****8040 for account ***3345."`

### `finance.transactionType`

Returns a random transaction type.

- Canonical: `awd.domain.finance.transactionType`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.transactionType()
```

Example return values:
- `"invoice"`
- `"deposit"`
