import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_CROCODILIA_KEYWORD_DEFINITION = {
  keyword: 'animal.crocodilia',
  delegate: {
    type: 'faker',
    target: 'animal.crocodilia',
  },
  help: {
    summary: 'Returns a random crocodilian species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.crocodilia',
        sampleReturnValue: 'Gharial',
        description: 'Shows the default animal.crocodilia call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_CROCODILIA_KEYWORD_DEFINITION };
