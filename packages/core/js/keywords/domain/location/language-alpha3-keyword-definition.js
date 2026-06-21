import { validateLanguageAlpha3Value } from '../../../command-help/command-help-validators.js';

const LOCATION_LANGUAGE_ALPHA3_KEYWORD_DEFINITION = {
  keyword: 'location.language.alpha3',
  delegate: {
    type: 'faker',
    target: 'location.language',
    resultPath: 'alpha3',
  },
  help: {
    summary: 'Returns a random ISO 639-2 or ISO 639-3 language code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateLanguageAlpha3Value,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.language.alpha3',
        sampleReturnValue: 'pan',
        description: 'Shows the default location.language.alpha3 call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_LANGUAGE_ALPHA3_KEYWORD_DEFINITION };
