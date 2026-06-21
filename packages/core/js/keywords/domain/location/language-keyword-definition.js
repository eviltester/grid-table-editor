import { validateObjectValue } from '../../../command-help/command-help-validators.js';

const LOCATION_LANGUAGE_KEYWORD_DEFINITION = {
  keyword: 'location.language',
  delegate: {
    type: 'faker',
    target: 'location.language',
  },
  help: {
    summary: 'Returns a random spoken language.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateObjectValue,
    returnType: 'object',
    usageExamples: [
      {
        functionCall: 'location.language',
        sampleReturnValue: {
          name: 'Punjabi',
          alpha2: 'pa',
          alpha3: 'pan',
        },
        description: 'Shows the default location.language call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_LANGUAGE_KEYWORD_DEFINITION };
