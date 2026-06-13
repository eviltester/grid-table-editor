const DOMAIN_CUSTOM_AUTOINCREMENT_KEYWORD_DEFINITIONS = [
  {
    keyword: 'autoIncrement.sequence',
    delegate: {
      type: 'custom',
      target: 'autoIncrement.sequence',
    },
    help: {
      summary:
        'Generates an incrementing sequence. Values only advance when a generated row is accepted, so constraint-filtered rows do not consume sequence numbers.',
      docsUrl: 'https://anywaydata.com/docs/test-data/auto-increment-sequences',
      example: '1',
      examples: [
        'autoIncrement.sequence()',
        'autoIncrement.sequence(start=10, step=5)',
        'autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)',
      ],
      exampleReturnValues: ['1', '15', 'filename001.txt'],
      returnType: 'string|number',
      args: [
        {
          name: 'start',
          type: 'integer',
          required: false,
          description: 'Starting integer in the sequence. Defaults to 1.',
          examples: [10],
        },
        {
          name: 'step',
          type: 'integer',
          required: false,
          description: 'Non-zero amount added after each accepted row. Defaults to 1.',
          examples: [5],
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'Optional text added before the numeric portion.',
          examples: ['filename'],
        },
        {
          name: 'suffix',
          type: 'string',
          required: false,
          description: 'Optional text added after the numeric portion.',
          examples: ['.txt'],
        },
        {
          name: 'zeropadding',
          type: 'integer',
          required: false,
          description:
            'Total digit width for the numeric portion. A value of 3 renders 1 as 001, while 100 stays 100. Defaults to 0.',
          examples: [3],
        },
      ],
    },
  },
];

export { DOMAIN_CUSTOM_AUTOINCREMENT_KEYWORD_DEFINITIONS };
