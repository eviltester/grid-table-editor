import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMPANY_BUZZ_VERB_KEYWORD_DEFINITION = {
  keyword: 'company.buzzVerb',
  delegate: {
    type: 'faker',
    target: 'company.buzzVerb',
  },
  help: {
    summary: 'Returns a random buzz verb that can be used to demonstrate data being viewed by a manager.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
    fakerDocsUrl: 'https://fakerjs.dev/api/company',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'company.buzzVerb',
        sampleReturnValue: 'grow',
        description: 'Shows the default company.buzzVerb call.',
      },
    ],
    args: [],
  },
};

export { COMPANY_BUZZ_VERB_KEYWORD_DEFINITION };
