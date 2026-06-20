import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_BEAR_KEYWORD_DEFINITION = {
  keyword: 'animal.bear',
  delegate: {
    type: 'faker',
    target: 'animal.bear',
  },
  help: {
    summary: 'Returns a random bear species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.bear',
        sampleReturnValue: 'Giant panda',
        description: 'Shows the default animal.bear call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_BEAR_KEYWORD_DEFINITION };
