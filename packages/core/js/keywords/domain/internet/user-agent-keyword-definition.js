import { validateStringValue } from '../../../command-help/command-help-validators.js';

const INTERNET_USER_AGENT_KEYWORD_DEFINITION = {
  keyword: 'internet.userAgent',
  delegate: {
    type: 'faker',
    target: 'internet.userAgent',
  },
  help: {
    summary: 'Generates a random user agent string.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.userAgent',
        sampleReturnValue:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/586.0.30 (KHTML, like Gecko) Version/16.1 Safari/546.9.18',
        description: 'Shows the default internet.userAgent call.',
      },
    ],
    args: [],
  },
};

export { INTERNET_USER_AGENT_KEYWORD_DEFINITION };
