import { validateDateValue } from '../../../command-help/command-help-validators.js';

const DATE_FUTURE_KEYWORD_DEFINITION = {
  keyword: 'date.future',
  delegate: {
    type: 'faker',
    target: 'date.future',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random date in the future.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateDateValue,
    returnType: 'date',
    usageExamples: [
      {
        functionCall: 'date.future()',
        sampleReturnValue: '2026-11-17T21:02:06.523Z',
        description: 'Shows date.future when optional params are omitted.',
      },
      {
        functionCall: 'date.future(refDate=1577836800000)',
        sampleReturnValue: '2020-06-01T05:06:46.523Z',
        description: 'Shows date.future using refDate.',
      },
      {
        functionCall: 'date.future(years=2)',
        sampleReturnValue: '2027-04-19T02:08:52.463Z',
        description: 'Shows date.future using years.',
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
        description: 'The range of years the date may be in the future.',
        examples: [2],
      },
    ],
  },
};

export { DATE_FUTURE_KEYWORD_DEFINITION };
