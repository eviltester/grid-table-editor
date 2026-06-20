import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMPANY_CATCH_PHRASE_KEYWORD_DEFINITION = {
  keyword: 'company.catchPhrase',
  delegate: {
    type: 'faker',
    target: 'company.catchPhrase',
  },
  help: {
    summary: 'Generates a random catch phrase that can be displayed to an end user.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
    fakerDocsUrl: 'https://fakerjs.dev/api/company',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'company.catchPhrase',
        sampleReturnValue: 'Integrated radical ability',
        description: 'Shows the default company.catchPhrase call.',
      },
    ],
    args: [],
  },
};

export { COMPANY_CATCH_PHRASE_KEYWORD_DEFINITION };
