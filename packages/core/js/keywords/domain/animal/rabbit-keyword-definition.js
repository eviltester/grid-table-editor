import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_RABBIT_KEYWORD_DEFINITION = {
  keyword: 'animal.rabbit',
  delegate: {
    type: 'faker',
    target: 'animal.rabbit',
  },
  help: {
    summary: 'Returns a random rabbit species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.rabbit',
        sampleReturnValue: 'Florida White',
        description: 'Shows the default animal.rabbit call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_RABBIT_KEYWORD_DEFINITION };
