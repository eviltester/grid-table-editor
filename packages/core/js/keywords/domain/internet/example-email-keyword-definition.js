import { validateExampleEmailValue } from '../../../command-help/command-help-validators.js';

const INTERNET_EXAMPLE_EMAIL_KEYWORD_DEFINITION = {
  keyword: 'internet.exampleEmail',
  delegate: {
    type: 'faker',
    target: 'internet.exampleEmail',
  },
  help: {
    summary: 'Generates data using faker internet example email.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateExampleEmailValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.exampleEmail',
        sampleReturnValue: 'Edwin.Dibbert@example.net',
        description: 'Shows the default internet.exampleEmail call.',
      },
    ],
    args: [],
  },
};

export { INTERNET_EXAMPLE_EMAIL_KEYWORD_DEFINITION };
