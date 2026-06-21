import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HACKER_VERB_KEYWORD_DEFINITION = {
  keyword: 'hacker.verb',
  delegate: {
    type: 'faker',
    target: 'hacker.verb',
  },
  help: {
    summary: 'Returns a random hacker/IT verb.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
    fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'hacker.verb',
        sampleReturnValue: 'hack',
        description: 'Shows the default hacker.verb call.',
      },
    ],
    args: [],
  },
};

export { HACKER_VERB_KEYWORD_DEFINITION };
