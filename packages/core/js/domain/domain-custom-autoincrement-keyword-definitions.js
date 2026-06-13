const DOMAIN_CUSTOM_AUTOINCREMENT_KEYWORD_DEFINITIONS = [
  {
    keyword: 'autoIncrement.timestamp',
    delegate: {
      type: 'custom',
      target: 'autoIncrement.timestamp',
    },
    help: {
      summary:
        'Generates a timestamp that starts from a fixed point and increments by the configured amount for each generated row.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/autoIncrement',
      example: 'autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds")',
      examples: [
        'autoIncrement.timestamp()',
        'autoIncrement.timestamp(start="20/03/1969", step=1, type="days")',
        'autoIncrement.timestamp(start="2026-06-12 12:39:23", step=15, type="minutes", outputFormat="yyyy-MM-dd HH:mm:ss")',
      ],
      exampleReturnValues: ['2026-06-12T12:39:23Z', '2026-06-12T12:39:24Z', '2026-06-12T12:39:25Z'],
      returnType: 'string',
      args: [
        {
          name: 'start',
          type: 'string|number',
          required: false,
          description:
            'Starting timestamp. Defaults to the generation run start time. Valid examples include "2026-06-12T12:39:23Z", "20/03/1969", "12-06-2026 12:39:23", or a Unix timestamp like 1718195963000.',
          examples: ['2026-06-12T12:39:23Z', '20/03/1969', 1718195963000],
        },
        {
          name: 'step',
          type: 'number',
          required: false,
          description: 'Amount added for each generated row. Defaults to 1.',
          examples: [1, 15],
        },
        {
          name: 'type',
          type: 'string',
          required: false,
          description:
            'Unit applied to step for each row. Supports milliseconds, seconds, minutes, hours, days, weeks, months, or years. Defaults to seconds.',
          examples: ['seconds', 'days'],
        },
        {
          name: 'outputFormat',
          type: 'string',
          required: false,
          description:
            'Output format. Defaults to ISO-8601 without milliseconds. Use "iso8601" for the default behaviour or a custom pattern such as "yyyy-MM-dd HH:mm:ss".',
          examples: ['iso8601', "yyyy-MM-dd'T'HH:mm:ssXXX"],
        },
        {
          name: 'inputFormat',
          type: 'string',
          required: false,
          description:
            'Optional parse pattern used only for the start argument when you want to match a specific text shape such as "dd/MM/yyyy" or "dd-MM-yyyy HH:mm:ss".',
          examples: ['dd/MM/yyyy', 'yyyy-MM-dd HH:mm:ss'],
        },
      ],
    },
  },
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
