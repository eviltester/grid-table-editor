import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_TYPE_KEYWORD_DEFINITION = {
  keyword: 'animal.type',
  delegate: {
    type: 'faker',
    target: 'animal.type',
  },
  help: {
    summary: 'Returns a random animal type.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.type',
        sampleReturnValue: 'giraffe',
        description: 'Shows the default animal.type call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_TYPE_KEYWORD_DEFINITION };
