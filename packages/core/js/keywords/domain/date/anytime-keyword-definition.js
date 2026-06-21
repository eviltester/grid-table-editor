import { validateDateValue } from '../../../command-help/command-help-validators.js';

const DATE_ANYTIME_KEYWORD_DEFINITION = {
  keyword: 'date.anytime',
  delegate: {
    type: 'faker',
    target: 'date.anytime',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random date that can be either in the past or in the future.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateDateValue,
    returnType: 'date',
    usageExamples: [
      {
        functionCall: 'date.anytime()',
        sampleReturnValue: '2026-04-19T02:08:51.881Z',
        description: 'Shows date.anytime when optional params are omitted.',
      },
      {
        functionCall: 'date.anytime(refDate=1577836800000)',
        sampleReturnValue: '2019-11-01T10:13:31.881Z',
        description: 'Shows date.anytime using refDate.',
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
    ],
  },
};

export { DATE_ANYTIME_KEYWORD_DEFINITION };
