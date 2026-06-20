import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMMERCE_PRICE_KEYWORD_DEFINITION = {
  keyword: 'commerce.price',
  delegate: {
    type: 'faker',
    target: 'commerce.price',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a price between min and max (inclusive).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
    fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'commerce.price(dec=2, max=10, min=1, symbol="$")',
        sampleReturnValue: '$4.79',
        description: 'Shows commerce.price in use.',
      },
      {
        functionCall: 'commerce.price()',
        sampleReturnValue: '417.69',
        description: 'Shows commerce.price when optional params are omitted.',
      },
      {
        functionCall: 'commerce.price(dec=2)',
        sampleReturnValue: '417.69',
        description: 'Shows commerce.price using dec.',
      },
      {
        functionCall: 'commerce.price(max=100)',
        sampleReturnValue: '42.29',
        description: 'Shows commerce.price using max.',
      },
      {
        functionCall: 'commerce.price(max=10, min=1)',
        sampleReturnValue: '4.79',
        description: 'Shows commerce.price using min.',
      },
      {
        functionCall: 'commerce.price(symbol="$")',
        sampleReturnValue: '$417.69',
        description: 'Shows commerce.price using symbol.',
      },
    ],
    args: [
      {
        name: 'dec',
        type: 'integer',
        required: false,
        description: 'The number of decimal places.',
        examples: [2],
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'The maximum price.',
        examples: [100],
      },
      {
        name: 'min',
        type: 'number',
        required: false,
        description: 'The minimum price.',
        examples: [1],
      },
      {
        name: 'symbol',
        type: 'string',
        required: false,
        description: 'The currency value to use.',
        examples: ['$'],
      },
    ],
  },
};

export { COMMERCE_PRICE_KEYWORD_DEFINITION };
