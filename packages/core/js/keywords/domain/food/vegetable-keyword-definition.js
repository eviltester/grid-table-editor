import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FOOD_VEGETABLE_KEYWORD_DEFINITION = {
  keyword: 'food.vegetable',
  delegate: {
    type: 'faker',
    target: 'food.vegetable',
  },
  help: {
    summary: 'Generates a random vegetable name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
    fakerDocsUrl: 'https://fakerjs.dev/api/food',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'food.vegetable',
        sampleReturnValue: 'eggplant',
        description: 'Shows the default food.vegetable call.',
      },
    ],
    args: [],
  },
};

export { FOOD_VEGETABLE_KEYWORD_DEFINITION };
