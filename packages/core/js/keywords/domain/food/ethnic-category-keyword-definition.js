import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FOOD_ETHNIC_CATEGORY_KEYWORD_DEFINITION = {
  keyword: 'food.ethnicCategory',
  delegate: {
    type: 'faker',
    target: 'food.ethnicCategory',
  },
  help: {
    summary: "Generates a random food's ethnic category.",
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
    fakerDocsUrl: 'https://fakerjs.dev/api/food',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'food.ethnicCategory',
        sampleReturnValue: 'Indonesian',
        description: 'Shows the default food.ethnicCategory call.',
      },
    ],
    args: [],
  },
};

export { FOOD_ETHNIC_CATEGORY_KEYWORD_DEFINITION };
