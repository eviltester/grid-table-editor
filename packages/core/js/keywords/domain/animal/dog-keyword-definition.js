import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_DOG_KEYWORD_DEFINITION = {
  keyword: 'animal.dog',
  delegate: {
    type: 'faker',
    target: 'animal.dog',
  },
  help: {
    summary: 'Returns a random dog breed.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.dog',
        sampleReturnValue: 'Grand Bleu de Gascogne',
        description: 'Shows the default animal.dog call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_DOG_KEYWORD_DEFINITION };
