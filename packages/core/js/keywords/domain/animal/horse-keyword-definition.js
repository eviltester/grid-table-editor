import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_HORSE_KEYWORD_DEFINITION = {
  keyword: 'animal.horse',
  delegate: {
    type: 'faker',
    target: 'animal.horse',
  },
  help: {
    summary: 'Returns a random horse breed.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.horse',
        sampleReturnValue: 'Heihe Horse',
        description: 'Shows the default animal.horse call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_HORSE_KEYWORD_DEFINITION };
