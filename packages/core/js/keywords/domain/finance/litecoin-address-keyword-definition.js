import { validateLitecoinAddressValue } from '../../../command-help/command-help-validators.js';

const FINANCE_LITECOIN_ADDRESS_KEYWORD_DEFINITION = {
  keyword: 'finance.litecoinAddress',
  delegate: {
    type: 'faker',
    target: 'finance.litecoinAddress',
  },
  help: {
    summary: 'Generates a random Litecoin address.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateLitecoinAddressValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.litecoinAddress',
        sampleReturnValue: '31i96bmpxqFcS2Eqy9cNYjGST53aS',
        description: 'Shows the default finance.litecoinAddress call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_LITECOIN_ADDRESS_KEYWORD_DEFINITION };
