import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FOOD_DISH_KEYWORD_DEFINITION = {
  keyword: 'food.dish',
  delegate: {
    type: 'faker',
    target: 'food.dish',
  },
  help: {
    summary: 'Generates a random dish name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
    fakerDocsUrl: 'https://fakerjs.dev/api/food',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'food.dish',
        sampleReturnValue: 'Cinnamon-crusted Chicken',
        description: 'Shows the default food.dish call.',
      },
    ],
    args: [],
  },
};

export { FOOD_DISH_KEYWORD_DEFINITION };
