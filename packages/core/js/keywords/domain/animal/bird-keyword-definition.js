import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_BIRD_KEYWORD_DEFINITION = {
  keyword: 'animal.bird',
  delegate: {
    type: 'faker',
    target: 'animal.bird',
  },
  help: {
    summary: 'Returns a random bird species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.bird',
        sampleReturnValue: 'Great-tailed Grackle',
        description: 'Shows the default animal.bird call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_BIRD_KEYWORD_DEFINITION };
