import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_COUNTRY_KEYWORD_DEFINITION = {
  keyword: 'location.country',
  delegate: {
    type: 'faker',
    target: 'location.country',
  },
  help: {
    summary: 'Returns a random country name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.country',
        sampleReturnValue: 'India',
        description: 'Shows the default location.country call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_COUNTRY_KEYWORD_DEFINITION };
