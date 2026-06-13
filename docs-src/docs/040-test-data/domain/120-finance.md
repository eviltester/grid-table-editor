---
sidebar_position: 120
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
- `Investment Account`

### `finance.accountNumber`

Generates a random account number.

- Canonical: `awd.domain.finance.accountNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |

Examples:

```txt
finance.accountNumber()
```

```txt
finance.accountNumber(length=1)
```

Example return values:
- `43208795`

### `finance.amount`

Generates a random amount between the given bounds (inclusive).

- Canonical: `awd.domain.finance.amount`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `autoFormat` | `boolean` | no | If true this method will use Number.toLocaleString(). Otherwise it will use Number.toFixed(). |
| `dec` | `integer` | no | The number of decimal places for the amount. |
| `max` | `number` | no | The upper bound for the amount. |
| `min` | `number` | no | The lower bound for the amount. |
| `symbol` | `string` | no | The symbol used to prefix the amount. |

Examples:

```txt
finance.amount()
```

Type-in examples (named params):

```txt
finance.amount(autoFormat=true)
```

Example return values:
- `536.86`

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
- `TXWRPYFT`

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
- `39fu5Nhnibj2xa8FPVxCbX7y4xZi5SWd`

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
- `839`

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
- `jcb`

### `finance.creditCardNumber`

Generates a random credit card number.

- Canonical: `awd.domain.finance.creditCardNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `issuer` | `string` | no | Issuer or provider value used to constrain generated output. |

Examples:

```txt
finance.creditCardNumber()
```

```txt
finance.creditCardNumber(issuer="value")
```

Example return values:
- `6449-4462-4996-7580`

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
- `{"name":"Rial Omani","code":"OMR","symbol":"﷼","numericCode":"512"}`

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
- `ISK`

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
- `South Sudanese pound`

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
- `270`

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
- `₩`

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
- `0xf5d385aff27de9dee6eeeffd924ffd7dd2d252ca`

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
- `CH67001759079BP5WA811`

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
- `M7nWopfUfSjA8cmGWvuENRLu6GU4C1iTK`

### `finance.maskedNumber`

Generates a random masked number.

- Canonical: `awd.domain.finance.maskedNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |

Examples:

```txt
finance.maskedNumber()
```

```txt
finance.maskedNumber(length=1)
```

Example return values:
- `(...0934)`

### `finance.pin`

Generates a random PIN number.

- Canonical: `awd.domain.finance.pin`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |

Examples:

```txt
finance.pin()
```

```txt
finance.pin(length=1)
```

Example return values:
- `1107`

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
- `933657999`

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
- `Transaction alert: deposit at Jones LLC using card ending ****4221 for an amount of GIP 94.88 on account ***3694.`

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
- `deposit`
