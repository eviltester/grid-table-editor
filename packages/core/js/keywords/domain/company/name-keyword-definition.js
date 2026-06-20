import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMPANY_NAME_KEYWORD_DEFINITION = {
  keyword: 'company.name',
  delegate: {
    type: 'faker',
    target: 'company.name',
  },
  help: {
    summary: 'Generates a random company name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
    fakerDocsUrl: 'https://fakerjs.dev/api/company',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'company.name',
        sampleReturnValue: 'Gutmann Group',
        description: 'Shows the default company.name call.',
      },
    ],
    args: [],
  },
};

export { COMPANY_NAME_KEYWORD_DEFINITION };
