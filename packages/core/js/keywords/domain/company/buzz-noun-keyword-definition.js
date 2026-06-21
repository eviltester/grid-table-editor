import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMPANY_BUZZ_NOUN_KEYWORD_DEFINITION = {
  keyword: 'company.buzzNoun',
  delegate: {
    type: 'faker',
    target: 'company.buzzNoun',
  },
  help: {
    summary: 'Returns a random buzz noun that can be used to demonstrate data being viewed by a manager.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
    fakerDocsUrl: 'https://fakerjs.dev/api/company',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'company.buzzNoun',
        sampleReturnValue: 'interfaces',
        description: 'Shows the default company.buzzNoun call.',
      },
    ],
    args: [],
  },
};

export { COMPANY_BUZZ_NOUN_KEYWORD_DEFINITION };
