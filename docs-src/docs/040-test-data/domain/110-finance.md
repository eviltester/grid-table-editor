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
- `"Savings Account"`
- `"Home Loan Account"`

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
- `"49018866"`
- `"60456794"`

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
- `"149.16"`
- `"691.98"`

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
- `"JAHFCDRAXXX"`
- `"HDJFBRUQ"`

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
- `"bc1pzsw5kl430n3mlhd5snxf8jsn8w8pkn5szswd2vdgswryyd6reuhljezh79"`
- `"bc1y7ndstl65j0lqw6zn65e7c2aglznrqyect4sejh"`

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
- `"642"`
- `"505"`

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
- `"diners_club"`
- `"discover"`

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
- `"4253595338386"`
- `"3680-760929-2509"`

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
- `&#123;"name":"Pakistan Rupee","code":"PKR","symbol":"₨","numericCode":"586"&#125;`
- `&#123;"name":"Bahraini Dinar","code":"BHD","symbol":"","numericCode":"048"&#125;`

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
- `"HNL"`
- `"VND"`

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
- `"Tugrik"`
- `"Lilangeni"`

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
- `"784"`
- `"784"`

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
- `"₨"`
- `"kr"`

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
- `"0x607cf8c49d90bd4d367fd5dc2fc4af6bebdedf17"`
- `"0xff0d2ab192cfbeb8ebcd74c4306eceb3f150ae70"`

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
- `"IE60XZAD39998435857068"`
- `"NO1827072008009"`

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
- `"Mx5xmnGzMKFjCoEa4sP7AtsMHWMqY1M7a"`
- `"MUt8eNXLSYpeiDoKiTof8BetGJpuM"`

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
- `"(...0214)"`
- `"(...5189)"`

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
- `"3243"`
- `"9247"`

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
- `"128948329"`
- `"799587533"`

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
- `"Your deposit of YER 512.78 at Schoen and Sons was successful. Charged via card ****1684 to account ***5866."`
- `"payment at Gislason, Herzog and Ankunding with a card ending in ****9045 for PYG 683.99 from account ***3048."`

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
- `"deposit"`
- `"payment"`
