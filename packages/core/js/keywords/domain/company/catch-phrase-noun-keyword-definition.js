import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMPANY_CATCH_PHRASE_NOUN_KEYWORD_DEFINITION = {
  keyword: 'company.catchPhraseNoun',
  delegate: {
    type: 'faker',
    target: 'company.catchPhraseNoun',
  },
  help: {
    summary: 'Returns a random catch phrase noun that can be displayed to an end user.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
    fakerDocsUrl: 'https://fakerjs.dev/api/company',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'company.catchPhraseNoun',
        sampleReturnValue: 'generative AI',
        description: 'Shows the default company.catchPhraseNoun call.',
      },
    ],
    args: [],
  },
};

export { COMPANY_CATCH_PHRASE_NOUN_KEYWORD_DEFINITION };
