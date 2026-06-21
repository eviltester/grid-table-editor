import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_LION_KEYWORD_DEFINITION = {
  keyword: 'animal.lion',
  delegate: {
    type: 'faker',
    target: 'animal.lion',
  },
  help: {
    summary: 'Returns a random lion species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.lion',
        sampleReturnValue: 'Cape lion',
        description: 'Shows the default animal.lion call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_LION_KEYWORD_DEFINITION };
