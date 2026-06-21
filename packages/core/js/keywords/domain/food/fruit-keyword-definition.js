import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FOOD_FRUIT_KEYWORD_DEFINITION = {
  keyword: 'food.fruit',
  delegate: {
    type: 'faker',
    target: 'food.fruit',
  },
  help: {
    summary: 'Generates a random fruit name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
    fakerDocsUrl: 'https://fakerjs.dev/api/food',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'food.fruit',
        sampleReturnValue: 'grapefruit',
        description: 'Shows the default food.fruit call.',
      },
    ],
    args: [],
  },
};

export { FOOD_FRUIT_KEYWORD_DEFINITION };
