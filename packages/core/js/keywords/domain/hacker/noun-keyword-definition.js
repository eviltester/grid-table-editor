import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HACKER_NOUN_KEYWORD_DEFINITION = {
  keyword: 'hacker.noun',
  delegate: {
    type: 'faker',
    target: 'hacker.noun',
  },
  help: {
    summary: 'Returns a random hacker/IT noun.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
    fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'hacker.noun',
        sampleReturnValue: 'firewall',
        description: 'Shows the default hacker.noun call.',
      },
    ],
    args: [],
  },
};

export { HACKER_NOUN_KEYWORD_DEFINITION };
