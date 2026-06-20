import { validateTimeZoneValue } from '../../../command-help/command-help-validators.js';

const LOCATION_TIME_ZONE_KEYWORD_DEFINITION = {
  keyword: 'location.timeZone',
  delegate: {
    type: 'faker',
    target: 'location.timeZone',
  },
  help: {
    summary: 'Returns a random IANA time zone name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateTimeZoneValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.timeZone',
        sampleReturnValue: 'America/Santiago',
        description: 'Shows the default location.timeZone call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_TIME_ZONE_KEYWORD_DEFINITION };
