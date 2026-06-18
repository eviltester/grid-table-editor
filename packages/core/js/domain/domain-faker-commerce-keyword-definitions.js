import { validateIsbnValue, validateStringValue, validateUpcValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_COMMERCE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'commerce.department',
    delegate: {
      type: 'faker',
      target: 'commerce.department',
    },
    help: {
      summary: 'Returns a department inside a shop.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
      fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'commerce.department',
          sampleReturnValue: 'Grocery',
          description: 'Shows the default commerce.department call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'commerce.isbn',
    delegate: {
      type: 'faker',
      target: 'commerce.isbn',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random ISBN identifier.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
      fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
      validator: validateIsbnValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'commerce.isbn()',
          sampleReturnValue: '978-0-7031-0133-4',
          description: 'Shows commerce.isbn when optional params are omitted.',
        },
        {
          functionCall: 'commerce.isbn(separator="-")',
          sampleReturnValue: '978-0-7031-0133-4',
          description: 'Shows commerce.isbn using separator.',
        },
        {
          functionCall: 'commerce.isbn(variant=10)',
          sampleReturnValue: '0-7031-0133-1',
          description: 'Shows commerce.isbn using variant.',
        },
      ],
      args: [
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: 'Separator inserted between generated items.',
        },
        {
          name: 'variant',
          type: '10|13',
          required: false,
          description: 'ISBN length variant: use 10 for ISBN-10 or 13 for ISBN-13.',
        },
      ],
    },
  },
  {
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
  },
  {
    keyword: 'commerce.product',
    delegate: {
      type: 'faker',
      target: 'commerce.product',
    },
    help: {
      summary: 'Returns a short product name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
      fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'commerce.product',
          sampleReturnValue: 'Gloves',
          description: 'Shows the default commerce.product call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'commerce.productAdjective',
    delegate: {
      type: 'faker',
      target: 'commerce.productAdjective',
    },
    help: {
      summary: 'Returns an adjective describing a product.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
      fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'commerce.productAdjective',
          sampleReturnValue: 'Handmade',
          description: 'Shows the default commerce.productAdjective call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'commerce.productDescription',
    delegate: {
      type: 'faker',
      target: 'commerce.productDescription',
    },
    help: {
      summary: 'Returns a product description.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
      fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'commerce.productDescription',
          sampleReturnValue: 'New Sausages model with 1 GB RAM, 303 GB storage, and bruised features',
          description: 'Shows the default commerce.productDescription call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'commerce.productMaterial',
    delegate: {
      type: 'faker',
      target: 'commerce.productMaterial',
    },
    help: {
      summary: 'Returns a material of a product.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
      fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'commerce.productMaterial',
          sampleReturnValue: 'Gold',
          description: 'Shows the default commerce.productMaterial call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'commerce.productName',
    delegate: {
      type: 'faker',
      target: 'commerce.productName',
    },
    help: {
      summary: 'Generates a random descriptive product name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
      fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'commerce.productName',
          sampleReturnValue: 'Handmade Plastic Bacon',
          description: 'Shows the default commerce.productName call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'commerce.upc',
    delegate: {
      type: 'faker',
      target: 'commerce.upc',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a valid UPC-A (12 digits).',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
      fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
      validator: validateUpcValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'commerce.upc()',
          sampleReturnValue: '470310133543',
          description: 'Shows commerce.upc when optional params are omitted.',
        },
        {
          functionCall: 'commerce.upc(prefix="01234")',
          sampleReturnValue: '012344703103',
          description: 'Shows commerce.upc using prefix.',
        },
      ],
      args: [
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'Optional numeric prefix for the UPC body (0-11 digits).',
          examples: ['01234'],
        },
      ],
    },
  },
];

export { DOMAIN_FAKER_COMMERCE_KEYWORD_DEFINITIONS };
