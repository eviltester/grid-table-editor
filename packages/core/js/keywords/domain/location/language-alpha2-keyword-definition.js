import { validateLanguageAlpha2Value } from '../../../command-help/command-help-validators.js';

const LOCATION_LANGUAGE_ALPHA2_KEYWORD_DEFINITION = {
  keyword: 'location.language.alpha2',
  delegate: {
    type: 'faker',
    target: 'location.language',
    resultPath: 'alpha2',
  },
  help: {
    summary: 'Returns a random ISO 639-1 language code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateLanguageAlpha2Value,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.language.alpha2',
        sampleReturnValue: 'pa',
        description: 'Shows the default location.language.alpha2 call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_LANGUAGE_ALPHA2_KEYWORD_DEFINITION };
