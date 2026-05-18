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
- `"Credit Card Account"`
- `"Money Market Account"`

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
- `"03137375"`
- `"42973099"`

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
finance.amount(autoFormat=true)
```

Example return values:
- `"392.28"`
- `"635.95"`

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
- `"UWBOMLCG"`
- `"BRKXLU6K"`

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
- `"3gNN1EcswoDePhssPHEwLbx1KrH1YQyN"`
- `"3GJnZPYkp5jLiU3tPrDTmibeNP8iLC"`

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
- `"056"`
- `"394"`

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
- `"visa"`
- `"mastercard"`

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
- `"6555-9446-2632-4771"`
- `"2720-5719-6089-8547"`

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
- `{"name":"Pataca","code":"MOP","symbol":"","numericCode":"446"}`
- `{"name":"Euro","code":"EUR","symbol":"€","numericCode":"978"}`

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
- `"VES"`
- `"KES"`

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
- `"Cayman Islands Dollar"`
- `"Moldovan Leu"`

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
- `"834"`
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
- `"Kč"`
- `"$"`

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
- `"0x4eb5993200faabd55a6aba35ddd1faaaca5aa80c"`
- `"0x5f083592cb0dc4e29042d4aa1e6ba312cbc5779e"`

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
finance.iban(countryCode="GB")
```

Example return values:
- `"IS849506798900662060044725"`
- `"XK782550322005043919"`

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
- `"3BnL3KVe4qQVLHL9c6RyNtuKXj"`
- `"MRzdcHBAmbwDaFJ7YJN621drBQ"`

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
- `"(...7159)"`
- `"(...1453)"`

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
- `"3844"`
- `"0948"`

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
- `"115741982"`
- `"803461901"`

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
- `"Transaction alert: invoice at Treutel, Hessel and Boyle using card ending ****5194 for an amount of VND 71.45 on account ***5536."`
- `"A invoice for GIP 518.56 was made at Schmeler, Shanahan and Braun via card ending ****4972 on account ***7736."`

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
