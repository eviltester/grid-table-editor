import { createStringEnumValidator } from '../../../command-help/command-help-validators.js';

const HTTP_PROTOCOL_RETURN_TYPE = 'http|https';

const validateProtocolValue = createStringEnumValidator(HTTP_PROTOCOL_RETURN_TYPE.split('|'));

const INTERNET_PROTOCOL_KEYWORD_DEFINITION = {
  keyword: 'internet.protocol',
  delegate: {
    type: 'faker',
    target: 'internet.protocol',
  },
  help: {
    summary: 'Returns a random web protocol. Either `http` or `https`.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateProtocolValue,
    returnType: HTTP_PROTOCOL_RETURN_TYPE,
    usageExamples: [
      {
        functionCall: 'internet.protocol',
        sampleReturnValue: 'http',
        description: 'Shows the default internet.protocol call.',
      },
    ],
    args: [],
  },
};

export { INTERNET_PROTOCOL_KEYWORD_DEFINITION };
