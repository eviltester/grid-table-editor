import { validateDateValue } from '../../../command-help/command-help-validators.js';

const DATE_RECENT_KEYWORD_DEFINITION = {
  keyword: 'date.recent',
  delegate: {
    type: 'faker',
    target: 'date.recent',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random date in the recent past.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateDateValue,
    returnType: 'date',
    usageExamples: [
      {
        functionCall: 'date.recent()',
        sampleReturnValue: '2026-06-18T01:55:50.284Z',
        description: 'Shows date.recent when optional params are omitted.',
      },
      {
        functionCall: 'date.recent(days=7)',
        sampleReturnValue: '2026-06-14T13:58:54.491Z',
        description: 'Shows date.recent using days.',
      },
      {
        functionCall: 'date.recent(refDate=1577836800000)',
        sampleReturnValue: '2019-12-31T10:00:30.284Z',
        description: 'Shows date.recent using refDate.',
      },
    ],
    args: [
      {
        name: 'days',
        type: 'integer',
        required: false,
        description: 'The range of days the date may be in the past.',
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

export { DATE_RECENT_KEYWORD_DEFINITION };
