import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_SNAKE_KEYWORD_DEFINITION = {
  keyword: 'animal.snake',
  delegate: {
    type: 'faker',
    target: 'animal.snake',
  },
  help: {
    summary: 'Returns a random snake species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.snake',
        sampleReturnValue: 'Harlequin coral snake',
        description: 'Shows the default animal.snake call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_SNAKE_KEYWORD_DEFINITION };
