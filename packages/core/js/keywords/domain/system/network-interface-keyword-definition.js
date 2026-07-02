import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_NETWORK_INTERFACE_KEYWORD_DEFINITION = {
  keyword: 'system.networkInterface',
  delegate: {
    type: 'faker',
    target: 'system.networkInterface',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random network interface.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.networkInterface()',
        sampleReturnValue: 'wlx042125686a3e',
        description: 'Shows the default system.networkInterface call.',
      },
      {
        functionCall: 'system.networkInterface(interfaceType="en", interfaceSchema="mac")',
        sampleReturnValue: 'enx6b042125686a',
        description: 'Shows system.networkInterface using interface type and schema options.',
      },
      {
        functionCall: 'system.networkInterface(interfaceType="en")',
        sampleReturnValue: 'ens7f3d0',
        description: 'Shows system.networkInterface using an explicit interface type.',
      },
      {
        functionCall: 'system.networkInterface(interfaceSchema="mac")',
        sampleReturnValue: 'wlxb042125686a3',
        description: 'Shows system.networkInterface using an explicit interface schema.',
      },
    ],
    args: [
      {
        name: 'interfaceType',
        type: 'en|wl|ww',
        required: false,
        description: 'Network interface type prefix.',
        examples: ['en'],
      },
      {
        name: 'interfaceSchema',
        type: 'index|slot|mac|pci',
        required: false,
        description: 'Network interface naming schema.',
        examples: ['mac'],
      },
    ],
  },
};

export { SYSTEM_NETWORK_INTERFACE_KEYWORD_DEFINITION };
