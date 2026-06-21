import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_PET_NAME_KEYWORD_DEFINITION = {
  keyword: 'animal.petName',
  delegate: {
    type: 'faker',
    target: 'animal.petName',
  },
  help: {
    summary: 'Returns a random pet name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.petName',
        sampleReturnValue: 'Gus',
        description: 'Shows the default animal.petName call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_PET_NAME_KEYWORD_DEFINITION };
