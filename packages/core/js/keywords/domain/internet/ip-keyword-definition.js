import { validateIpValue } from '../../../command-help/command-help-validators.js';

const INTERNET_IP_KEYWORD_DEFINITION = {
  keyword: 'internet.ip',
  delegate: {
    type: 'faker',
    target: 'internet.ip',
  },
  help: {
    summary: 'Generates a random IPv4 or IPv6 address.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateIpValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.ip',
        sampleReturnValue: '184.103.47.157',
        description: 'Shows the default internet.ip call.',
      },
    ],
    args: [],
  },
};

export { INTERNET_IP_KEYWORD_DEFINITION };
