import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_CONTINENT_KEYWORD_DEFINITION = {
  keyword: 'location.continent',
  delegate: {
    type: 'faker',
    target: 'location.continent',
  },
  help: {
    summary: 'Returns a random continent name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.continent',
        sampleReturnValue: 'Asia',
        description: 'Shows the default location.continent call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_CONTINENT_KEYWORD_DEFINITION };
