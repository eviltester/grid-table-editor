import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_CITY_KEYWORD_DEFINITION = {
  keyword: 'location.city',
  delegate: {
    type: 'faker',
    target: 'location.city',
  },
  help: {
    summary: 'Generates a random localized city name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.city',
        sampleReturnValue: 'Edwinville',
        description: 'Shows the default location.city call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_CITY_KEYWORD_DEFINITION };
