import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_LANGUAGE_NAME_KEYWORD_DEFINITION = {
  keyword: 'location.language.name',
  delegate: {
    type: 'faker',
    target: 'location.language',
    resultPath: 'name',
  },
  help: {
    summary: 'Returns a random spoken language name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.language.name',
        sampleReturnValue: 'Punjabi',
        description: 'Shows the default location.language.name call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_LANGUAGE_NAME_KEYWORD_DEFINITION };
