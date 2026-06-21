import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_CAT_KEYWORD_DEFINITION = {
  keyword: 'animal.cat',
  delegate: {
    type: 'faker',
    target: 'animal.cat',
  },
  help: {
    summary: 'Returns a random cat breed.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.cat',
        sampleReturnValue: 'Korat',
        description: 'Shows the default animal.cat call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_CAT_KEYWORD_DEFINITION };
