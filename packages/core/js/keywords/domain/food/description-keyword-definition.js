import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FOOD_DESCRIPTION_KEYWORD_DEFINITION = {
  keyword: 'food.description',
  delegate: {
    type: 'faker',
    target: 'food.description',
  },
  help: {
    summary: 'Generates a random dish description.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
    fakerDocsUrl: 'https://fakerjs.dev/api/food',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'food.description',
        sampleReturnValue: 'An exquisite artichoke dish, paired with brown rice and a hint of cardamom.',
        description: 'Shows the default food.description call.',
      },
    ],
    args: [],
  },
};

export { FOOD_DESCRIPTION_KEYWORD_DEFINITION };
