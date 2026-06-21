import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMPANY_BUZZ_ADJECTIVE_KEYWORD_DEFINITION = {
  keyword: 'company.buzzAdjective',
  delegate: {
    type: 'faker',
    target: 'company.buzzAdjective',
  },
  help: {
    summary: 'Returns a random buzz adjective that can be used to demonstrate data being viewed by a manager.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
    fakerDocsUrl: 'https://fakerjs.dev/api/company',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'company.buzzAdjective',
        sampleReturnValue: 'immersive',
        description: 'Shows the default company.buzzAdjective call.',
      },
    ],
    args: [],
  },
};

export { COMPANY_BUZZ_ADJECTIVE_KEYWORD_DEFINITION };
