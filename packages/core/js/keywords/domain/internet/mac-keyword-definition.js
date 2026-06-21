import { validateMacAddressValue } from '../../../command-help/command-help-validators.js';

const MAC_SEPARATOR_TYPE = '":"|"-"|""';

const INTERNET_MAC_KEYWORD_DEFINITION = {
  keyword: 'internet.mac',
  delegate: {
    type: 'faker',
    target: 'internet.mac',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random mac address.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateMacAddressValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.mac()',
        sampleReturnValue: '6b:04:21:25:68:6a',
        description: 'Shows internet.mac when optional params are omitted.',
      },
      {
        functionCall: 'internet.mac(separator="-")',
        sampleReturnValue: '6b-04-21-25-68-6a',
        description: 'Shows internet.mac using separator.',
      },
    ],
    args: [
      {
        name: 'separator',
        type: MAC_SEPARATOR_TYPE,
        required: false,
        description: "The optional separator to use. Can be either ':', '-' or ''.",
      },
    ],
  },
};

export { INTERNET_MAC_KEYWORD_DEFINITION };
