import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FOOD_SPICE_KEYWORD_DEFINITION = {
  keyword: 'food.spice',
  delegate: {
    type: 'faker',
    target: 'food.spice',
  },
  help: {
    summary: 'Generates a random spice name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
    fakerDocsUrl: 'https://fakerjs.dev/api/food',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'food.spice',
        sampleReturnValue: 'fines herbes',
        description: 'Shows the default food.spice call.',
      },
    ],
    args: [],
  },
};

export { FOOD_SPICE_KEYWORD_DEFINITION };
