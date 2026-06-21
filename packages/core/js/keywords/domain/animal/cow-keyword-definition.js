import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_COW_KEYWORD_DEFINITION = {
  keyword: 'animal.cow',
  delegate: {
    type: 'faker',
    target: 'animal.cow',
  },
  help: {
    summary: 'Returns a random cow species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.cow',
        sampleReturnValue: 'Gascon cattle',
        description: 'Shows the default animal.cow call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_COW_KEYWORD_DEFINITION };
