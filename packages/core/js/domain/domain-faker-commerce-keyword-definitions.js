const DOMAIN_FAKER_COMMERCE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'commerce.department',
    delegate: {
      type: 'faker',
      target: 'commerce.department',
    },
    help: {
      summary: 'Returns a department inside a shop.',
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Tools',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: '978-1-996134-54-2',
      returnType: 'string',
      args: [
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: 'Separator inserted between generated items.',
        },
        {
          name: 'variant',
          type: 'string',
          required: false,
          description: 'ISBN length variant: use "10" for ISBN-10 or "13" for ISBN-13.',
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
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: '797.39',
      returnType: 'number',
      args: [
        {
          name: 'dec',
          type: 'number',
          required: false,
          description: 'The number of decimal places.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The maximum price.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The minimum price.',
        },
        {
          name: 'symbol',
          type: 'string',
          required: false,
          description: 'The currency value to use.',
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
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Bike',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Luxurious',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'The green Hat combines Colombia aesthetics with Scandium-based durability',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Steel',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Soft Bronze Towels',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_COMMERCE_KEYWORD_DEFINITIONS };
