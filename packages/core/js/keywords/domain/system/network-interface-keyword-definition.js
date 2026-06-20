import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_NETWORK_INTERFACE_KEYWORD_DEFINITION = {
  keyword: 'system.networkInterface',
  delegate: {
    type: 'faker',
    target: 'system.networkInterface',
  },
  help: {
    summary: 'Returns a random network interface.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.networkInterface',
        sampleReturnValue: 'wlx042125686a3e',
        description: 'Shows the default system.networkInterface call.',
      },
    ],
    args: [],
  },
};

export { SYSTEM_NETWORK_INTERFACE_KEYWORD_DEFINITION };
