import { validateDateValue } from '../../../command-help/command-help-validators.js';

const DATE_SOON_KEYWORD_DEFINITION = {
  keyword: 'date.soon',
  delegate: {
    type: 'faker',
    target: 'date.soon',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random date in the near future.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateDateValue,
    returnType: 'date',
    usageExamples: [
      {
        functionCall: 'date.soon()',
        sampleReturnValue: '2026-06-19T01:55:51.284Z',
        description: 'Shows date.soon when optional params are omitted.',
      },
      {
        functionCall: 'date.soon(days=7)',
        sampleReturnValue: '2026-06-21T13:58:55.491Z',
        description: 'Shows date.soon using days.',
      },
      {
        functionCall: 'date.soon(refDate=1577836800000)',
        sampleReturnValue: '2020-01-01T10:00:31.284Z',
        description: 'Shows date.soon using refDate.',
      },
    ],
    args: [
      {
        name: 'days',
        type: 'integer',
        required: false,
        description: 'The range of days the date may be in the future.',
        examples: [7],
      },
      {
        name: 'refDate',
        type: 'integer',
        required: false,
        description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        examples: [1577836800000],
      },
    ],
  },
};

export { DATE_SOON_KEYWORD_DEFINITION };
