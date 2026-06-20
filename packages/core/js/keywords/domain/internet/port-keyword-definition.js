import { validateNumberValue } from '../../../command-help/command-help-validators.js';

const INTERNET_PORT_KEYWORD_DEFINITION = {
  keyword: 'internet.port',
  delegate: {
    type: 'faker',
    target: 'internet.port',
  },
  help: {
    summary: 'Generates a random port number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateNumberValue,
    returnType: 'number',
    usageExamples: [
      {
        functionCall: 'internet.port',
        sampleReturnValue: 27329,
        description: 'Shows the default internet.port call.',
      },
    ],
    args: [],
  },
};

export { INTERNET_PORT_KEYWORD_DEFINITION };
