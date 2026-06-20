import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HACKER_PHRASE_KEYWORD_DEFINITION = {
  keyword: 'hacker.phrase',
  delegate: {
    type: 'faker',
    target: 'hacker.phrase',
  },
  help: {
    summary: 'Generates a random hacker/IT phrase.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
    fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'hacker.phrase',
        sampleReturnValue: 'Try to back up the COM bus, maybe it will hack the mobile bus!',
        description: 'Shows the default hacker.phrase call.',
      },
    ],
    args: [],
  },
};

export { HACKER_PHRASE_KEYWORD_DEFINITION };
