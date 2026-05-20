const DOMAIN_FAKER_FINANCE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'finance.accountName',
    delegate: {
      type: 'faker',
      target: 'finance.accountName',
    },
    help: {
      summary: 'Generates a random account name.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'Investment Account',
      returnType: 'integer',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '43208795',
      returnType: 'integer',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '536.86',
      returnType: 'number',
      args: [
        {
          name: 'autoFormat',
          type: 'boolean',
          required: false,
          description: 'If true this method will use Number.toLocaleString(). Otherwise it will use Number.toFixed().',
        },
        {
          name: 'dec',
          type: 'number',
          required: false,
          description: 'The number of decimal places for the amount.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The upper bound for the amount.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The lower bound for the amount.',
        },
        {
          name: 'symbol',
          type: 'string',
          required: false,
          description: 'The symbol used to prefix the amount.',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'TXWRPYFT',
      returnType: 'string',
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
    },
    help: {
      summary: 'Generates a random Bitcoin address.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '39fu5Nhnibj2xa8FPVxCbX7y4xZi5SWd',
      returnType: 'string',
      args: [],
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '839',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'jcb',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '6449-4462-4996-7580',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '{"name":"Rial Omani","code":"OMR","symbol":"﷼","numericCode":"512"}',
      returnType: 'object',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'ISK',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'South Sudanese pound',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '270',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '₩',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '0xf5d385aff27de9dee6eeeffd924ffd7dd2d252ca',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'CH67001759079BP5WA811',
      returnType: 'string',
      args: [
        {
          name: 'countryCode',
          type: 'string',
          required: false,
          description:
            'The country code from which you want to generate an IBAN, if none is provided a random country will be used.',
        },
        {
          name: 'formatted',
          type: 'boolean',
          required: false,
          description: 'Return a formatted version of the generated IBAN.',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'M7nWopfUfSjA8cmGWvuENRLu6GU4C1iTK',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.maskedNumber',
    delegate: {
      type: 'faker',
      target: 'finance.maskedNumber',
    },
    help: {
      summary: 'Generates a random masked number.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '(...0934)',
      returnType: 'string',
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
    keyword: 'finance.pin',
    delegate: {
      type: 'faker',
      target: 'finance.pin',
    },
    help: {
      summary: 'Generates a random PIN number.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '1107',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '933657999',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example:
        'Transaction alert: deposit at Jones LLC using card ending ****4221 for an amount of GIP 94.88 on account ***3694.',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'deposit',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_FINANCE_KEYWORD_DEFINITIONS };
