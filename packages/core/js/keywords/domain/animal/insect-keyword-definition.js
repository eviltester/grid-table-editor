import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_INSECT_KEYWORD_DEFINITION = {
  keyword: 'animal.insect',
  delegate: {
    type: 'faker',
    target: 'animal.insect',
  },
  help: {
    summary: 'Returns a random insect species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.insect',
        sampleReturnValue: 'Honey bee',
        description: 'Shows the default animal.insect call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_INSECT_KEYWORD_DEFINITION };
