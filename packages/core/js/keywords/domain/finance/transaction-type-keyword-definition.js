import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FINANCE_TRANSACTION_TYPE_KEYWORD_DEFINITION = {
  keyword: 'finance.transactionType',
  delegate: {
    type: 'faker',
    target: 'finance.transactionType',
  },
  help: {
    summary: 'Returns a random transaction type.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.transactionType',
        sampleReturnValue: 'invoice',
        description: 'Shows the default finance.transactionType call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_TRANSACTION_TYPE_KEYWORD_DEFINITION };
