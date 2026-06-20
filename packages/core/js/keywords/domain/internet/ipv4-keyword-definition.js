import { validateIpv4Value } from '../../../command-help/command-help-validators.js';

const IPV4_NETWORK_TYPE =
  'any|loopback|private-a|private-b|private-c|test-net-1|test-net-2|test-net-3|link-local|multicast';

const INTERNET_IPV4_KEYWORD_DEFINITION = {
  keyword: 'internet.ipv4',
  delegate: {
    type: 'faker',
    target: 'internet.ipv4',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random IPv4 address.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateIpv4Value,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.ipv4()',
        sampleReturnValue: '106.193.244.63',
        description: 'Shows internet.ipv4 when optional params are omitted.',
      },
      {
        functionCall: 'internet.ipv4(cidrBlock="192.168.0.0/24")',
        sampleReturnValue: '192.168.0.106',
        description: 'Shows internet.ipv4 using cidrBlock.',
      },
      {
        functionCall: 'internet.ipv4(network="private-a")',
        sampleReturnValue: '10.106.193.244',
        description: 'Shows internet.ipv4 using network.',
      },
    ],
    args: [
      {
        name: 'cidrBlock',
        type: 'string',
        required: false,
        description: 'The optional CIDR block to use. Must be in the format x.x.x.x/y.',
        examples: ['192.168.0.0/24'],
      },
      {
        name: 'network',
        type: IPV4_NETWORK_TYPE,
        required: false,
        description: 'The optional network to use. This is intended as an alias for well-known cidrBlocks.',
        examples: ['private-a'],
      },
    ],
  },
};

export { INTERNET_IPV4_KEYWORD_DEFINITION };
