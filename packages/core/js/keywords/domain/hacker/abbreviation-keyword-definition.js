import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HACKER_ABBREVIATION_KEYWORD_DEFINITION = {
  keyword: 'hacker.abbreviation',
  delegate: {
    type: 'faker',
    target: 'hacker.abbreviation',
  },
  help: {
    summary: 'Returns a random hacker/IT abbreviation.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
    fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'hacker.abbreviation',
        sampleReturnValue: 'IP',
        description: 'Shows the default hacker.abbreviation call.',
      },
    ],
    args: [],
  },
};

export { HACKER_ABBREVIATION_KEYWORD_DEFINITION };
