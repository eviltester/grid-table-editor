import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_COUNTY_KEYWORD_DEFINITION = {
  keyword: 'location.county',
  delegate: {
    type: 'faker',
    target: 'location.county',
  },
  help: {
    summary:
      "Returns a random localized county, or other equivalent second-level administrative entity for the locale's country such as a district or department.",
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.county',
        sampleReturnValue: 'Cleveland',
        description: 'Shows the default location.county call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_COUNTY_KEYWORD_DEFINITION };
