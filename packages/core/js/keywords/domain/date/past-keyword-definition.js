import { validateDateValue } from '../../../command-help/command-help-validators.js';

const DATE_PAST_KEYWORD_DEFINITION = {
  keyword: 'date.past',
  delegate: {
    type: 'faker',
    target: 'date.past',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random date in the past.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateDateValue,
    returnType: 'date',
    usageExamples: [
      {
        functionCall: 'date.past()',
        sampleReturnValue: '2025-11-17T21:02:05.523Z',
        description: 'Shows date.past when optional params are omitted.',
      },
      {
        functionCall: 'date.past(refDate=1577836800000)',
        sampleReturnValue: '2019-06-02T05:06:45.523Z',
        description: 'Shows date.past using refDate.',
      },
      {
        functionCall: 'date.past(years=2)',
        sampleReturnValue: '2025-04-19T02:08:51.463Z',
        description: 'Shows date.past using years.',
      },
    ],
    args: [
      {
        name: 'refDate',
        type: 'integer',
        required: false,
        description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        examples: [1577836800000],
      },
      {
        name: 'years',
        type: 'integer',
        required: false,
        description: 'The range of years the date may be in the past.',
        examples: [2],
      },
    ],
  },
};

export { DATE_PAST_KEYWORD_DEFINITION };
