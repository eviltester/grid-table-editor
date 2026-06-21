import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_FISH_KEYWORD_DEFINITION = {
  keyword: 'animal.fish',
  delegate: {
    type: 'faker',
    target: 'animal.fish',
  },
  help: {
    summary: 'Returns a random fish species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.fish',
        sampleReturnValue: 'Gazami crab',
        description: 'Shows the default animal.fish call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_FISH_KEYWORD_DEFINITION };
