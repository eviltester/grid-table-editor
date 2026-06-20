import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FINANCE_TRANSACTION_DESCRIPTION_KEYWORD_DEFINITION = {
  keyword: 'finance.transactionDescription',
  delegate: {
    type: 'faker',
    target: 'finance.transactionDescription',
  },
  help: {
    summary: 'Generates a random transaction description.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.transactionDescription',
        sampleReturnValue:
          'You made a payment of AED 302.33 at Hegmann - Johnston using card ending in ****6280 from account ***6451.',
        description: 'Shows the default finance.transactionDescription call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_TRANSACTION_DESCRIPTION_KEYWORD_DEFINITION };
