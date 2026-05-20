const DOMAIN_CUSTOM_LITERAL_KEYWORD_DEFINITIONS = [
  {
    keyword: 'literal.value',
    delegate: {
      type: 'custom',
      target: 'literal.value',
    },
    help: {
      summary: 'Return the literal value provided by the caller.',
      docsUrl: 'https://anywaydata.com/docs/category/generating-data',
      example: 'Pending',
      examples: ['literal.value("Pending")', 'literal.value("")'],
      exampleReturnValues: ['Pending', ''],
      returnType: 'string',
      args: [
        {
          name: 'value',
          type: 'string|number|boolean',
          required: false,
          description: 'Literal value to return. When omitted, defaults to an empty string.',
        },
      ],
    },
  },
];

export { DOMAIN_CUSTOM_LITERAL_KEYWORD_DEFINITIONS };
