import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HACKER_INGVERB_KEYWORD_DEFINITION = {
  keyword: 'hacker.ingverb',
  delegate: {
    type: 'faker',
    target: 'hacker.ingverb',
  },
  help: {
    summary: 'Returns a random hacker/IT verb for continuous actions (en: ing suffix; e.g. hacking).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
    fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'hacker.ingverb',
        sampleReturnValue: 'generating',
        description: 'Shows the default hacker.ingverb call.',
      },
    ],
    args: [],
  },
};

export { HACKER_INGVERB_KEYWORD_DEFINITION };
