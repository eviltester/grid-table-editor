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

Shows the default finance.accountName call.

```txt
finance.accountName
```

Returns: `Home Loan Account`

### `finance.accountNumber`

Generates a random account number.

- Canonical: `awd.domain.finance.accountNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |

Examples:

Shows finance.accountNumber when optional params are omitted.

```txt
finance.accountNumber()
```

Returns: `47031013`

Shows finance.accountNumber using length.

```txt
finance.accountNumber(length=5)
```

Returns: `47031`

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

Shows finance.amount when optional params are omitted.

```txt
finance.amount()
```

Returns: `417.02`

Shows finance.amount using autoFormat.

```txt
finance.amount(autoFormat=true)
```

Returns: `417.02`

Shows finance.amount using dec.

```txt
finance.amount(dec=2)
```

Returns: `417.02`

Shows finance.amount using max.

```txt
finance.amount(max=100)
```

Returns: `41.70`

Shows finance.amount using min.

```txt
finance.amount(max=10, min=1)
```

Returns: `4.75`

Shows finance.amount using symbol.

```txt
finance.amount(symbol="$")
```

Returns: `$417.02`

### `finance.bic`

Generates a random SWIFT/BIC code based on the ISO-9362 format.

- Canonical: `awd.domain.finance.bic`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `includeBranchCode` | `boolean` | no | Whether to include a three-digit branch code at the end of the generated code. |

Examples:

Shows finance.bic when optional params are omitted.

```txt
finance.bic()
```

Returns: `SAHDBI6CJFO`

Shows finance.bic using includeBranchCode.

```txt
finance.bic(includeBranchCode=true)
```

Returns: `KSAHBZ36EJF`

### `finance.bitcoinAddress`

Generates a random Bitcoin address.

- Canonical: `awd.domain.finance.bitcoinAddress`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `legacy\|segwit\|bech32\|taproot` | no | The bitcoin address type ('legacy', 'segwit', 'bech32' or 'taproot'). |
| `network` | `mainnet\|testnet` | no | The bitcoin network ('mainnet' or 'testnet'). |

Examples:

Shows finance.bitcoinAddress when optional params are omitted.

```txt
finance.bitcoinAddress()
```

Returns: `31i96bmpxqFcS2Eqy9cNYjGST53aS6qX`

Shows finance.bitcoinAddress using type.

```txt
finance.bitcoinAddress(type="bech32")
```

Returns: `bc1fr0a536dekfp7w0pfk57tycqww326w4fykqcpu0`

Shows finance.bitcoinAddress using network.

```txt
finance.bitcoinAddress(network="testnet")
```

Returns: `21i96bmpxqFcS2Eqy9cNYjGST53aS6qX`

### `finance.creditCardCVV`

Generates a random credit card CVV.

- Canonical: `awd.domain.finance.creditCardCVV`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.creditCardCVV call.

```txt
finance.creditCardCVV
```

Returns: `470`

### `finance.creditCardIssuer`

Returns a random credit card issuer.

- Canonical: `awd.domain.finance.creditCardIssuer`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.creditCardIssuer call.

```txt
finance.creditCardIssuer
```

Returns: `discover`

### `finance.creditCardNumber`

Generates a random credit card number.

- Canonical: `awd.domain.finance.creditCardNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `issuer` | `string` | no | Issuer or provider value used to constrain generated output. |

Examples:

Shows finance.creditCardNumber when optional params are omitted.

```txt
finance.creditCardNumber()
```

Returns: `6503-1013-3546-2805`

Shows finance.creditCardNumber using issuer.

```txt
finance.creditCardNumber(issuer="Visa")
```

Returns: `4703101335466`

### `finance.currencyCode`

Returns a random currency code.

- Canonical: `awd.domain.finance.currencyCode`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.currencyCode call.

```txt
finance.currencyCode
```

Returns: `JOD`

### `finance.currencyName`

Returns a random currency name.

- Canonical: `awd.domain.finance.currencyName`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.currencyName call.

```txt
finance.currencyName
```

Returns: `Jordanian Dinar`

### `finance.currencyNumericCode`

Returns a random currency numeric code.

- Canonical: `awd.domain.finance.currencyNumericCode`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.currencyNumericCode call.

```txt
finance.currencyNumericCode
```

Returns: `400`

### `finance.currencySymbol`

Returns a random currency symbol.

- Canonical: `awd.domain.finance.currencySymbol`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.currencySymbol call.

```txt
finance.currencySymbol
```

Returns: `руб`

### `finance.ethereumAddress`

Creates a random, non-checksum Ethereum address.

- Canonical: `awd.domain.finance.ethereumAddress`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.ethereumAddress call.

```txt
finance.ethereumAddress
```

Returns: `0x9f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0a`

### `finance.iban`

Generates a random IBAN.

- Canonical: `awd.domain.finance.iban`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `countryCode` | `string` | no | The country code from which you want to generate an IBAN, if none is provided a random country will be used. |
| `formatted` | `boolean` | no | Return a formatted version of the generated IBAN. |

Examples:

Shows finance.iban when optional params are omitted.

```txt
finance.iban()
```

Returns: `IE39SAHD00454601410936`

Shows finance.iban using countryCode.

```txt
finance.iban(countryCode="GB")
```

Returns: `GB98KSAH00235420410936`

Shows finance.iban using formatted.

```txt
finance.iban(formatted=true)
```

Returns: `IE39 SAHD 0045 4601 4109 36`

### `finance.litecoinAddress`

Generates a random Litecoin address.

- Canonical: `awd.domain.finance.litecoinAddress`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.litecoinAddress call.

```txt
finance.litecoinAddress
```

Returns: `31i96bmpxqFcS2Eqy9cNYjGST53aS`

### `finance.pin`

Generates a random PIN number.

- Canonical: `awd.domain.finance.pin`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |

Examples:

Shows finance.pin when optional params are omitted.

```txt
finance.pin()
```

Returns: `4703`

Shows finance.pin using length.

```txt
finance.pin(length=5)
```

Returns: `47031`

### `finance.routingNumber`

Generates a random routing number.

- Canonical: `awd.domain.finance.routingNumber`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.routingNumber call.

```txt
finance.routingNumber
```

Returns: `470310139`

### `finance.transactionDescription`

Generates a random transaction description.

- Canonical: `awd.domain.finance.transactionDescription`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.transactionDescription call.

```txt
finance.transactionDescription
```

Returns: `You made a payment of AED 302.33 at Hegmann - Johnston using card ending in ****6280 from account ***6451.`

### `finance.transactionType`

Returns a random transaction type.

- Canonical: `awd.domain.finance.transactionType`
- Faker docs: [https://fakerjs.dev/api/finance](https://fakerjs.dev/api/finance)

No parameters.

Examples:

Shows the default finance.transactionType call.

```txt
finance.transactionType
```

Returns: `invoice`
