import { validateIpv6Value } from '../../../command-help/command-help-validators.js';

const INTERNET_IPV6_KEYWORD_DEFINITION = {
  keyword: 'internet.ipv6',
  delegate: {
    type: 'faker',
    target: 'internet.ipv6',
  },
  help: {
    summary: 'Generates a random IPv6 address.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateIpv6Value,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.ipv6',
        sampleReturnValue: '9f06:3247:8b9f:4d0e:9c34:bf6f:dd10:3d29',
        description: 'Shows the default internet.ipv6 call.',
      },
    ],
    args: [],
  },
};

export { INTERNET_IPV6_KEYWORD_DEFINITION };
