import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FOOD_ADJECTIVE_KEYWORD_DEFINITION = {
  keyword: 'food.adjective',
  delegate: {
    type: 'faker',
    target: 'food.adjective',
  },
  help: {
    summary: 'Generates a random dish adjective.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
    fakerDocsUrl: 'https://fakerjs.dev/api/food',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'food.adjective',
        sampleReturnValue: 'juicy',
        description: 'Shows the default food.adjective call.',
      },
    ],
    args: [],
  },
};

export { FOOD_ADJECTIVE_KEYWORD_DEFINITION };
