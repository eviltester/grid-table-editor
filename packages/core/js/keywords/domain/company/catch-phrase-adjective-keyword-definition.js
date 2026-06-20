import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMPANY_CATCH_PHRASE_ADJECTIVE_KEYWORD_DEFINITION = {
  keyword: 'company.catchPhraseAdjective',
  delegate: {
    type: 'faker',
    target: 'company.catchPhraseAdjective',
  },
  help: {
    summary: 'Returns a random catch phrase adjective that can be displayed to an end user.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
    fakerDocsUrl: 'https://fakerjs.dev/api/company',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'company.catchPhraseAdjective',
        sampleReturnValue: 'Integrated',
        description: 'Shows the default company.catchPhraseAdjective call.',
      },
    ],
    args: [],
  },
};

export { COMPANY_CATCH_PHRASE_ADJECTIVE_KEYWORD_DEFINITION };
