import { validateStringOrNumberValue, validateStringValue } from '../command-help/command-help-validators.js';

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
      fakerDocsUrl: '',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds")',
          sampleReturnValue: '2026-06-12T12:39:23Z',
          description: 'Shows autoIncrement.timestamp in use.',
        },
        {
          functionCall: 'autoIncrement.timestamp()',
          sampleReturnValue: '2026-06-18T15:55:20Z',
          description: 'Shows autoIncrement.timestamp in use.',
        },
        {
          functionCall: 'autoIncrement.timestamp(start="20/03/1969", step=1, type="days")',
          sampleReturnValue: '1969-03-20T12:00:00Z',
          description: 'Shows autoIncrement.timestamp in use.',
        },
        {
          functionCall:
            'autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=15, type="minutes", outputFormat="yyyy-MM-dd HH:mm:ss")',
          sampleReturnValue: '2026-06-12 12:39:23',
          description: 'Shows autoIncrement.timestamp using a custom output format.',
        },
        {
          functionCall: 'autoIncrement.timestamp(start="20/03/1969", inputFormat="dd/MM/yyyy", step=1, type="days")',
          sampleReturnValue: '1969-03-20T00:00:00Z',
          description: 'Shows autoIncrement.timestamp in use.',
        },
        {
          functionCall: 'autoIncrement.timestamp(start="2026-06-12T12:39:23Z")',
          sampleReturnValue: '2026-06-12T12:39:23Z',
          description: 'Shows autoIncrement.timestamp using start.',
        },
        {
          functionCall: 'autoIncrement.timestamp(step=1)',
          sampleReturnValue: '2026-06-18T15:55:20Z',
          description: 'Shows autoIncrement.timestamp using step.',
        },
        {
          functionCall: 'autoIncrement.timestamp(type="seconds")',
          sampleReturnValue: '2026-06-18T15:55:20Z',
          description: 'Shows autoIncrement.timestamp using type.',
        },
        {
          functionCall: 'autoIncrement.timestamp(outputFormat="iso8601")',
          sampleReturnValue: '2026-06-18T15:55:20Z',
          description: 'Shows autoIncrement.timestamp using outputFormat.',
        },
        {
          functionCall: 'autoIncrement.timestamp(start="20/03/1969", inputFormat="dd/MM/yyyy")',
          sampleReturnValue: '1969-03-20T00:00:00Z',
          description: 'Shows autoIncrement.timestamp using inputFormat.',
        },
      ],
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
      fakerDocsUrl: '',
      validator: validateStringOrNumberValue,
      returnType: 'string|number',
      usageExamples: [
        {
          functionCall: 'autoIncrement.sequence()',
          sampleReturnValue: 1,
          description: 'Shows autoIncrement.sequence in use.',
        },
        {
          functionCall: 'autoIncrement.sequence(start=10, step=5)',
          sampleReturnValue: 10,
          description: 'Shows autoIncrement.sequence in use.',
        },
        {
          functionCall: 'autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)',
          sampleReturnValue: 'filename001.txt',
          description: 'Shows autoIncrement.sequence in use.',
        },
        {
          functionCall: 'autoIncrement.sequence(start=10)',
          sampleReturnValue: 10,
          description: 'Shows autoIncrement.sequence using start.',
        },
        {
          functionCall: 'autoIncrement.sequence(step=5)',
          sampleReturnValue: 1,
          description: 'Shows autoIncrement.sequence using step.',
        },
        {
          functionCall: 'autoIncrement.sequence(prefix="filename")',
          sampleReturnValue: 'filename1',
          description: 'Shows autoIncrement.sequence using prefix.',
        },
        {
          functionCall: 'autoIncrement.sequence(suffix=".txt")',
          sampleReturnValue: '1.txt',
          description: 'Shows autoIncrement.sequence using suffix.',
        },
        {
          functionCall: 'autoIncrement.sequence(zeropadding=3)',
          sampleReturnValue: '001',
          description: 'Shows autoIncrement.sequence using zeropadding.',
        },
      ],
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
