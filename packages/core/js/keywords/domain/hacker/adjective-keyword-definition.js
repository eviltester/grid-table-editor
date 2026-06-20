import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HACKER_ADJECTIVE_KEYWORD_DEFINITION = {
  keyword: 'hacker.adjective',
  delegate: {
    type: 'faker',
    target: 'hacker.adjective',
  },
  help: {
    summary: 'Returns a random hacker/IT adjective.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
    fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'hacker.adjective',
        sampleReturnValue: 'mobile',
        description: 'Shows the default hacker.adjective call.',
      },
    ],
    args: [],
  },
};

export { HACKER_ADJECTIVE_KEYWORD_DEFINITION };
