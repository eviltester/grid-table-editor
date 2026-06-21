import { validateTimeZoneValue } from '../../../command-help/command-help-validators.js';

const DATE_TIME_ZONE_KEYWORD_DEFINITION = {
  keyword: 'date.timeZone',
  delegate: {
    type: 'faker',
    target: 'date.timeZone',
  },
  help: {
    summary: 'Returns a random IANA time zone relevant to this locale.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateTimeZoneValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'date.timeZone',
        sampleReturnValue: 'America/Santiago',
        description: 'Shows the default date.timeZone call.',
      },
    ],
    args: [],
  },
};

export { DATE_TIME_ZONE_KEYWORD_DEFINITION };
