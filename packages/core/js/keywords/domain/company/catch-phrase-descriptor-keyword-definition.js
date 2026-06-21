import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMPANY_CATCH_PHRASE_DESCRIPTOR_KEYWORD_DEFINITION = {
  keyword: 'company.catchPhraseDescriptor',
  delegate: {
    type: 'faker',
    target: 'company.catchPhraseDescriptor',
  },
  help: {
    summary: 'Returns a random catch phrase descriptor that can be displayed to an end user.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
    fakerDocsUrl: 'https://fakerjs.dev/api/company',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'company.catchPhraseDescriptor',
        sampleReturnValue: 'heuristic',
        description: 'Shows the default company.catchPhraseDescriptor call.',
      },
    ],
    args: [],
  },
};

export { COMPANY_CATCH_PHRASE_DESCRIPTOR_KEYWORD_DEFINITION };
