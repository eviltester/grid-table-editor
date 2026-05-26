const DOMAIN_CUSTOM_STRING_KEYWORD_DEFINITIONS = [
  {
    keyword: 'string.counterString',
    delegate: {
      type: 'custom',
      target: 'string.counterString',
    },
    help: {
      summary:
        'Generates a counterstring for a random length between min and max (or fixed length when only one value is provided). Defaults to min=1 and max=25 when omitted.',
      docsUrl: '/docs/test-data/counterstrings',
      example: '*3*5*7*9*12*15*',
      examples: [
        'string.counterString()',
        'string.counterString(15)',
        'string.counterString(min=5, max=12)',
        'string.counterString(min=12, max=12, delimiter="#")',
      ],
      exampleReturnValues: ['*3*5*7*9*12*15*', '#3#5#7#9#12#'],
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'integer',
          required: false,
          description:
            'Minimum counterstring length (integer). If max is omitted and min is provided, min is also used as max. Defaults to 1 when omitted. Non-integer values throw an exception.',
          examples: [5],
        },
        {
          name: 'max',
          type: 'integer',
          required: false,
          description:
            'Maximum counterstring length (integer). If less than min, values are swapped. Defaults to 25 when omitted. Non-integer values throw an exception.',
          examples: [12],
        },
        {
          name: 'delimiter',
          type: 'string',
          required: false,
          description: 'Delimiter character used between position markers. Defaults to "*".',
          examples: ['#'],
        },
      ],
    },
  },
];

export { DOMAIN_CUSTOM_STRING_KEYWORD_DEFINITIONS };
