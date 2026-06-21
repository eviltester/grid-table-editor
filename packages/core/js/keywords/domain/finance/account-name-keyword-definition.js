import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FINANCE_ACCOUNT_NAME_KEYWORD_DEFINITION = {
  keyword: 'finance.accountName',
  delegate: {
    type: 'faker',
    target: 'finance.accountName',
  },
  help: {
    summary: 'Generates a random account name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.accountName',
        sampleReturnValue: 'Home Loan Account',
        description: 'Shows the default finance.accountName call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_ACCOUNT_NAME_KEYWORD_DEFINITION };
