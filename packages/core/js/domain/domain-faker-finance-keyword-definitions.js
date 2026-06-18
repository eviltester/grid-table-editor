import {
  validateAccountNumberValue,
  validateBicValue,
  validateBitcoinAddressValue,
  validateCreditCardCvvValue,
  validateCreditCardNumberValue,
  validateCurrencyCodeValue,
  validateCurrencyNumericCodeValue,
  validateEthereumAddressValue,
  validateIbanValue,
  validateLitecoinAddressValue,
  validateObjectValue,
  validatePinValue,
  validateRoutingNumberValue,
  validateStringValue,
} from '../command-help/command-help-validators.js';

const BITCOIN_ADDRESS_TYPE = 'legacy|segwit|bech32|taproot';
const BITCOIN_NETWORK_TYPE = 'mainnet|testnet';

const DOMAIN_FAKER_FINANCE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'finance.accountName',
    delegate: {
      type: 'faker',
      target: 'finance.accountName',
    },
    help: {
      summary: 'Generates a random account name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.accountName',
          sampleReturnValue: 'Home Loan Account',
          description: 'Shows the default finance.accountName call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.accountNumber',
    delegate: {
      type: 'faker',
      target: 'finance.accountNumber',
    },
    help: {
      summary: 'Generates a random account number.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateAccountNumberValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.accountNumber()',
          sampleReturnValue: '47031013',
          description: 'Shows finance.accountNumber when optional params are omitted.',
        },
        {
          functionCall: 'finance.accountNumber(length=5)',
          sampleReturnValue: '47031',
          description: 'Shows finance.accountNumber using length.',
        },
      ],
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Desired length of the generated value.',
        },
      ],
    },
  },
  {
    keyword: 'finance.amount',
    delegate: {
      type: 'faker',
      target: 'finance.amount',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random amount between the given bounds (inclusive).',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.amount()',
          sampleReturnValue: '417.02',
          description: 'Shows finance.amount when optional params are omitted.',
        },
        {
          functionCall: 'finance.amount(autoFormat=true)',
          sampleReturnValue: '417.02',
          description: 'Shows finance.amount using autoFormat.',
        },
        {
          functionCall: 'finance.amount(dec=2)',
          sampleReturnValue: '417.02',
          description: 'Shows finance.amount using dec.',
        },
        {
          functionCall: 'finance.amount(max=100)',
          sampleReturnValue: '41.70',
          description: 'Shows finance.amount using max.',
        },
        {
          functionCall: 'finance.amount(max=10, min=1)',
          sampleReturnValue: '4.75',
          description: 'Shows finance.amount using min.',
        },
        {
          functionCall: 'finance.amount(symbol="$")',
          sampleReturnValue: '$417.02',
          description: 'Shows finance.amount using symbol.',
        },
      ],
      args: [
        {
          name: 'autoFormat',
          type: 'boolean',
          required: false,
          description: 'If true this method will use Number.toLocaleString(). Otherwise it will use Number.toFixed().',
          examples: [true],
        },
        {
          name: 'dec',
          type: 'integer',
          required: false,
          description: 'The number of decimal places for the amount.',
          examples: [2],
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The upper bound for the amount.',
          examples: [100],
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The lower bound for the amount.',
          examples: [1],
        },
        {
          name: 'symbol',
          type: 'string',
          required: false,
          description: 'The symbol used to prefix the amount.',
          examples: ['$'],
        },
      ],
    },
  },
  {
    keyword: 'finance.bic',
    delegate: {
      type: 'faker',
      target: 'finance.bic',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random SWIFT/BIC code based on the ISO-9362 format.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateBicValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.bic()',
          sampleReturnValue: 'SAHDBI6CJFO',
          description: 'Shows finance.bic when optional params are omitted.',
        },
        {
          functionCall: 'finance.bic(includeBranchCode=true)',
          sampleReturnValue: 'KSAHBZ36EJF',
          description: 'Shows finance.bic using includeBranchCode.',
        },
      ],
      args: [
        {
          name: 'includeBranchCode',
          type: 'boolean',
          required: false,
          description: 'Whether to include a three-digit branch code at the end of the generated code.',
        },
      ],
    },
  },
  {
    keyword: 'finance.bitcoinAddress',
    delegate: {
      type: 'faker',
      target: 'finance.bitcoinAddress',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random Bitcoin address.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateBitcoinAddressValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.bitcoinAddress()',
          sampleReturnValue: '31i96bmpxqFcS2Eqy9cNYjGST53aS6qX',
          description: 'Shows finance.bitcoinAddress when optional params are omitted.',
        },
        {
          functionCall: 'finance.bitcoinAddress(type="bech32")',
          sampleReturnValue: 'bc1fr0a536dekfp7w0pfk57tycqww326w4fykqcpu0',
          description: 'Shows finance.bitcoinAddress using type.',
        },
        {
          functionCall: 'finance.bitcoinAddress(network="testnet")',
          sampleReturnValue: '21i96bmpxqFcS2Eqy9cNYjGST53aS6qX',
          description: 'Shows finance.bitcoinAddress using network.',
        },
      ],
      args: [
        {
          name: 'type',
          type: BITCOIN_ADDRESS_TYPE,
          required: false,
          description: "The bitcoin address type ('legacy', 'segwit', 'bech32' or 'taproot').",
          examples: ['bech32'],
        },
        {
          name: 'network',
          type: BITCOIN_NETWORK_TYPE,
          required: false,
          description: "The bitcoin network ('mainnet' or 'testnet').",
          examples: ['testnet'],
        },
      ],
    },
  },
  {
    keyword: 'finance.creditCardCVV',
    delegate: {
      type: 'faker',
      target: 'finance.creditCardCVV',
    },
    help: {
      summary: 'Generates a random credit card CVV.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateCreditCardCvvValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.creditCardCVV',
          sampleReturnValue: '470',
          description: 'Shows the default finance.creditCardCVV call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.creditCardIssuer',
    delegate: {
      type: 'faker',
      target: 'finance.creditCardIssuer',
    },
    help: {
      summary: 'Returns a random credit card issuer.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.creditCardIssuer',
          sampleReturnValue: 'discover',
          description: 'Shows the default finance.creditCardIssuer call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.creditCardNumber',
    delegate: {
      type: 'faker',
      target: 'finance.creditCardNumber',
    },
    help: {
      summary: 'Generates a random credit card number.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateCreditCardNumberValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.creditCardNumber()',
          sampleReturnValue: '6503-1013-3546-2805',
          description: 'Shows finance.creditCardNumber when optional params are omitted.',
        },
        {
          functionCall: 'finance.creditCardNumber(issuer="Visa")',
          sampleReturnValue: '4703101335466',
          description: 'Shows finance.creditCardNumber using issuer.',
        },
      ],
      args: [
        {
          name: 'issuer',
          type: 'string',
          required: false,
          description: 'Issuer or provider value used to constrain generated output.',
        },
      ],
    },
  },
  {
    keyword: 'finance.currency',
    delegate: {
      type: 'faker',
      target: 'finance.currency',
    },
    help: {
      summary: 'Returns a random currency object, containing `code`, `name`, `symbol`, and `numericCode` properties.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateObjectValue,
      returnType: 'object',
      usageExamples: [
        {
          functionCall: 'finance.currency',
          sampleReturnValue: {
            name: 'Jordanian Dinar',
            code: 'JOD',
            symbol: '',
            numericCode: '400',
          },
          description: 'Shows the default finance.currency call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.currencyCode',
    delegate: {
      type: 'faker',
      target: 'finance.currencyCode',
    },
    help: {
      summary: 'Returns a random currency code.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateCurrencyCodeValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.currencyCode',
          sampleReturnValue: 'JOD',
          description: 'Shows the default finance.currencyCode call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.currencyName',
    delegate: {
      type: 'faker',
      target: 'finance.currencyName',
    },
    help: {
      summary: 'Returns a random currency name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.currencyName',
          sampleReturnValue: 'Jordanian Dinar',
          description: 'Shows the default finance.currencyName call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.currencyNumericCode',
    delegate: {
      type: 'faker',
      target: 'finance.currencyNumericCode',
    },
    help: {
      summary: 'Returns a random currency numeric code.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateCurrencyNumericCodeValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.currencyNumericCode',
          sampleReturnValue: '400',
          description: 'Shows the default finance.currencyNumericCode call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.currencySymbol',
    delegate: {
      type: 'faker',
      target: 'finance.currencySymbol',
    },
    help: {
      summary: 'Returns a random currency symbol.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.currencySymbol',
          sampleReturnValue: 'руб',
          description: 'Shows the default finance.currencySymbol call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.ethereumAddress',
    delegate: {
      type: 'faker',
      target: 'finance.ethereumAddress',
    },
    help: {
      summary: 'Creates a random, non-checksum Ethereum address.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateEthereumAddressValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.ethereumAddress',
          sampleReturnValue: '0x9f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0a',
          description: 'Shows the default finance.ethereumAddress call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.iban',
    delegate: {
      type: 'faker',
      target: 'finance.iban',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random IBAN.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateIbanValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.iban()',
          sampleReturnValue: 'IE39SAHD00454601410936',
          description: 'Shows finance.iban when optional params are omitted.',
        },
        {
          functionCall: 'finance.iban(countryCode="GB")',
          sampleReturnValue: 'GB98KSAH00235420410936',
          description: 'Shows finance.iban using countryCode.',
        },
        {
          functionCall: 'finance.iban(formatted=true)',
          sampleReturnValue: 'IE39 SAHD 0045 4601 4109 36',
          description: 'Shows finance.iban using formatted.',
        },
      ],
      args: [
        {
          name: 'countryCode',
          type: 'string',
          required: false,
          description:
            'The country code from which you want to generate an IBAN, if none is provided a random country will be used.',
          examples: ['GB'],
        },
        {
          name: 'formatted',
          type: 'boolean',
          required: false,
          description: 'Return a formatted version of the generated IBAN.',
          examples: [true],
        },
      ],
    },
  },
  {
    keyword: 'finance.litecoinAddress',
    delegate: {
      type: 'faker',
      target: 'finance.litecoinAddress',
    },
    help: {
      summary: 'Generates a random Litecoin address.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateLitecoinAddressValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.litecoinAddress',
          sampleReturnValue: '31i96bmpxqFcS2Eqy9cNYjGST53aS',
          description: 'Shows the default finance.litecoinAddress call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.pin',
    delegate: {
      type: 'faker',
      target: 'finance.pin',
    },
    help: {
      summary: 'Generates a random PIN number.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validatePinValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.pin()',
          sampleReturnValue: '4703',
          description: 'Shows finance.pin when optional params are omitted.',
        },
        {
          functionCall: 'finance.pin(length=5)',
          sampleReturnValue: '47031',
          description: 'Shows finance.pin using length.',
        },
      ],
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Desired length of the generated value.',
        },
      ],
    },
  },
  {
    keyword: 'finance.routingNumber',
    delegate: {
      type: 'faker',
      target: 'finance.routingNumber',
    },
    help: {
      summary: 'Generates a random routing number.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateRoutingNumberValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.routingNumber',
          sampleReturnValue: '470310139',
          description: 'Shows the default finance.routingNumber call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.transactionDescription',
    delegate: {
      type: 'faker',
      target: 'finance.transactionDescription',
    },
    help: {
      summary: 'Generates a random transaction description.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.transactionDescription',
          sampleReturnValue:
            'You made a payment of AED 302.33 at Hegmann - Johnston using card ending in ****6280 from account ***6451.',
          description: 'Shows the default finance.transactionDescription call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'finance.transactionType',
    delegate: {
      type: 'faker',
      target: 'finance.transactionType',
    },
    help: {
      summary: 'Returns a random transaction type.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
      fakerDocsUrl: 'https://fakerjs.dev/api/finance',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'finance.transactionType',
          sampleReturnValue: 'invoice',
          description: 'Shows the default finance.transactionType call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_FINANCE_KEYWORD_DEFINITIONS };
