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
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.accountName
```

Example return values:
- `Home Loan Account`

### `finance.accountNumber`

Generates a random account number.

- Canonical: `awd.domain.finance.accountNumber`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |

Examples:

```txt
finance.accountNumber()
```

```txt
finance.accountNumber(length=5)
```

Example return values:
- `47031013`
- `47031`

### `finance.amount`

Generates a random amount between the given bounds (inclusive).

- Canonical: `awd.domain.finance.amount`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
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

```txt
finance.amount(autoFormat=true)
```

```txt
finance.amount(dec=2)
```

```txt
finance.amount(max=100)
```

```txt
finance.amount(max=10, min=1)
```

```txt
finance.amount(symbol="$")
```

Example return values:
- `417.02`
- `417.02`
- `417.02`
- `41.70`
- `4.75`
- `$417.02`

### `finance.bic`

Generates a random SWIFT/BIC code based on the ISO-9362 format.

- Canonical: `awd.domain.finance.bic`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
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
- `SAHDBI6CJFO`
- `KSAHBZ36EJF`

### `finance.bitcoinAddress`

Generates a random Bitcoin address.

- Canonical: `awd.domain.finance.bitcoinAddress`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `legacy\|segwit\|bech32\|taproot` | no | The bitcoin address type ('legacy', 'segwit', 'bech32' or 'taproot'). |
| `network` | `mainnet\|testnet` | no | The bitcoin network ('mainnet' or 'testnet'). |

Examples:

```txt
finance.bitcoinAddress()
```

```txt
finance.bitcoinAddress(type="bech32")
```

```txt
finance.bitcoinAddress(network="testnet")
```

Example return values:
- `31i96bmpxqFcS2Eqy9cNYjGST53aS6qX`
- `bc1fr0a536dekfp7w0pfk57tycqww326w4fykqcpu0`
- `21i96bmpxqFcS2Eqy9cNYjGST53aS6qX`

### `finance.creditCardCVV`

Generates a random credit card CVV.

- Canonical: `awd.domain.finance.creditCardCVV`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.creditCardCVV
```

Example return values:
- `470`

### `finance.creditCardIssuer`

Returns a random credit card issuer.

- Canonical: `awd.domain.finance.creditCardIssuer`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.creditCardIssuer
```

Example return values:
- `discover`

### `finance.creditCardNumber`

Generates a random credit card number.

- Canonical: `awd.domain.finance.creditCardNumber`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `issuer` | `string` | no | Issuer or provider value used to constrain generated output. |

Examples:

```txt
finance.creditCardNumber()
```

```txt
finance.creditCardNumber(issuer="Visa")
```

Example return values:
- `6503-1013-3546-2805`
- `4703101335466`

### `finance.currency`

Returns a random currency object, containing `code`, `name`, `symbol`, and `numericCode` properties.

- Canonical: `awd.domain.finance.currency`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currency
```

Example return values:
- `{"name":"Jordanian Dinar","code":"JOD","symbol":"","numericCode":"400"}`

### `finance.currencyCode`

Returns a random currency code.

- Canonical: `awd.domain.finance.currencyCode`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currencyCode
```

Example return values:
- `JOD`

### `finance.currencyName`

Returns a random currency name.

- Canonical: `awd.domain.finance.currencyName`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currencyName
```

Example return values:
- `Jordanian Dinar`

### `finance.currencyNumericCode`

Returns a random currency numeric code.

- Canonical: `awd.domain.finance.currencyNumericCode`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currencyNumericCode
```

Example return values:
- `400`

### `finance.currencySymbol`

Returns a random currency symbol.

- Canonical: `awd.domain.finance.currencySymbol`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.currencySymbol
```

Example return values:
- `руб`

### `finance.ethereumAddress`

Creates a random, non-checksum Ethereum address.

- Canonical: `awd.domain.finance.ethereumAddress`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.ethereumAddress
```

Example return values:
- `0x9f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0a`

### `finance.iban`

Generates a random IBAN.

- Canonical: `awd.domain.finance.iban`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
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

```txt
finance.iban(formatted=true)
```

Example return values:
- `IE39SAHD00454601410936`
- `GB98KSAH00235420410936`
- `IE39 SAHD 0045 4601 4109 36`

### `finance.litecoinAddress`

Generates a random Litecoin address.

- Canonical: `awd.domain.finance.litecoinAddress`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.litecoinAddress
```

Example return values:
- `31i96bmpxqFcS2Eqy9cNYjGST53aS`

### `finance.pin`

Generates a random PIN number.

- Canonical: `awd.domain.finance.pin`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |

Examples:

```txt
finance.pin()
```

```txt
finance.pin(length=5)
```

Example return values:
- `4703`
- `47031`

### `finance.routingNumber`

Generates a random routing number.

- Canonical: `awd.domain.finance.routingNumber`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.routingNumber
```

Example return values:
- `470310139`

### `finance.transactionDescription`

Generates a random transaction description.

- Canonical: `awd.domain.finance.transactionDescription`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.transactionDescription
```

Example return values:
- `You made a payment of AED 302.33 at Hegmann - Johnston using card ending in ****6280 from account ***6451.`

### `finance.transactionType`

Returns a random transaction type.

- Canonical: `awd.domain.finance.transactionType`
- Docs: [https://anywaydata.com/docs/test-data/domain/finance](https://anywaydata.com/docs/test-data/domain/finance)
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

```txt
finance.transactionType
```

Example return values:
- `invoice`
