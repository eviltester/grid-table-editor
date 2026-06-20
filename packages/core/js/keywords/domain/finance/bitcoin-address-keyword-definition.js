import { validateBitcoinAddressValue } from '../../../command-help/command-help-validators.js';

const BITCOIN_ADDRESS_TYPE = 'legacy|segwit|bech32|taproot';

const BITCOIN_NETWORK_TYPE = 'mainnet|testnet';

const FINANCE_BITCOIN_ADDRESS_KEYWORD_DEFINITION = {
  keyword: 'finance.bitcoinAddress',
  delegate: {
    type: 'faker',
    target: 'finance.bitcoinAddress',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random Bitcoin address.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateBitcoinAddressValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.bitcoinAddress()',
        sampleReturnValue: '31i96bmpxqFcS2Eqy9cNYjGST53aS6qX',
        description: 'Shows finance.bitcoinAddress when optional params are omitted.',
      },
      {
        functionCall: 'finance.bitcoinAddress(type="bech32")',
        sampleReturnValue: 'bc1fr0a536dekfp7w0pfk57tycqww326w4fykqcpu0',
        description: 'Shows finance.bitcoinAddress using type.',
      },
      {
        functionCall: 'finance.bitcoinAddress(network="testnet")',
        sampleReturnValue: '21i96bmpxqFcS2Eqy9cNYjGST53aS6qX',
        description: 'Shows finance.bitcoinAddress using network.',
      },
    ],
    args: [
      {
        name: 'type',
        type: BITCOIN_ADDRESS_TYPE,
        required: false,
        description: "The bitcoin address type ('legacy', 'segwit', 'bech32' or 'taproot').",
        examples: ['bech32'],
      },
      {
        name: 'network',
        type: BITCOIN_NETWORK_TYPE,
        required: false,
        description: "The bitcoin network ('mainnet' or 'testnet').",
        examples: ['testnet'],
      },
    ],
  },
};

export { FINANCE_BITCOIN_ADDRESS_KEYWORD_DEFINITION };
