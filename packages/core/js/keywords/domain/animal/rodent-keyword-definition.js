import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_RODENT_KEYWORD_DEFINITION = {
  keyword: 'animal.rodent',
  delegate: {
    type: 'faker',
    target: 'animal.rodent',
  },
  help: {
    summary: 'Returns a random rodent breed.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.rodent',
        sampleReturnValue: 'Fukomys foxi',
        description: 'Shows the default animal.rodent call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_RODENT_KEYWORD_DEFINITION };
