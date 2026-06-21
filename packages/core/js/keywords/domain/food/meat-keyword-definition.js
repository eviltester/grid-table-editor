import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FOOD_MEAT_KEYWORD_DEFINITION = {
  keyword: 'food.meat',
  delegate: {
    type: 'faker',
    target: 'food.meat',
  },
  help: {
    summary: 'Generates a random meat',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
    fakerDocsUrl: 'https://fakerjs.dev/api/food',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'food.meat',
        sampleReturnValue: 'kangaroo',
        description: 'Shows the default food.meat call.',
      },
    ],
    args: [],
  },
};

export { FOOD_MEAT_KEYWORD_DEFINITION };
