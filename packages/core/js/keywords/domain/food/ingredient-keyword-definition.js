import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FOOD_INGREDIENT_KEYWORD_DEFINITION = {
  keyword: 'food.ingredient',
  delegate: {
    type: 'faker',
    target: 'food.ingredient',
  },
  help: {
    summary: 'Generates a random ingredient name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
    fakerDocsUrl: 'https://fakerjs.dev/api/food',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'food.ingredient',
        sampleReturnValue: 'green pepper',
        description: 'Shows the default food.ingredient call.',
      },
    ],
    args: [],
  },
};

export { FOOD_INGREDIENT_KEYWORD_DEFINITION };
