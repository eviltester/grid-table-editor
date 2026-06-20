import { validateArrayValue } from '../../../command-help/command-help-validators.js';

const DATE_BETWEENS_KEYWORD_DEFINITION = {
  keyword: 'date.betweens',
  delegate: {
    type: 'faker',
    target: 'date.betweens',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary:
      'Generates random dates between the given boundaries. The dates will be returned in an array sorted in chronological order.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateArrayValue,
    returnType: 'array',
    usageExamples: [
      {
        functionCall: 'date.betweens(from=1577836800000, to=1609372800000)',
        sampleReturnValue: ['2020-01-01T01:00:06.924Z', '2020-06-01T05:06:45.940Z', '2020-09-19T22:02:33.225Z'],
        description: 'Shows date.betweens with only the required range boundaries.',
      },
      {
        functionCall: 'date.betweens(count=2, from=1577836800000, to=1609372800000)',
        sampleReturnValue: ['2020-06-01T05:06:45.940Z', '2020-09-19T22:02:33.225Z'],
        description: 'Shows date.betweens returning two sorted dates within a range.',
      },
      {
        functionCall: 'date.betweens(count=3, from=1609459200000, to=1640995200000)',
        sampleReturnValue: ['2021-01-01T01:00:06.924Z', '2021-06-02T05:06:45.940Z', '2021-09-20T22:02:33.225Z'],
        description: 'Shows date.betweens using a larger count within a bounded range.',
      },
      {
        functionCall: 'date.betweens(count=4, from=1640995200000, to=1672531200000)',
        sampleReturnValue: [
          '2022-01-01T01:00:06.924Z',
          '2022-04-21T08:26:00.010Z',
          '2022-06-02T05:06:45.940Z',
          '2022-09-20T22:02:33.225Z',
        ],
        description: 'Shows date.betweens with count, from, and to all supplied explicitly.',
      },
    ],
    args: [
      {
        name: 'count',
        type: 'integer',
        required: false,
        description: 'The number of dates to generate.',
        examples: [2],
      },
      {
        name: 'from',
        type: 'integer',
        required: true,
        description: 'Start boundary as a Unix timestamp in milliseconds since epoch.',
        examples: [1577836800000],
      },
      {
        name: 'to',
        type: 'integer',
        required: true,
        description: 'End boundary as a Unix timestamp in milliseconds since epoch.',
        examples: [1609372800000],
      },
    ],
  },
};

export { DATE_BETWEENS_KEYWORD_DEFINITION };
