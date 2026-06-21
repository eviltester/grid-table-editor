import { validateEthereumAddressValue } from '../../../command-help/command-help-validators.js';

const FINANCE_ETHEREUM_ADDRESS_KEYWORD_DEFINITION = {
  keyword: 'finance.ethereumAddress',
  delegate: {
    type: 'faker',
    target: 'finance.ethereumAddress',
  },
  help: {
    summary: 'Creates a random, non-checksum Ethereum address.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateEthereumAddressValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.ethereumAddress',
        sampleReturnValue: '0x9f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0a',
        description: 'Shows the default finance.ethereumAddress call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_ETHEREUM_ADDRESS_KEYWORD_DEFINITION };
