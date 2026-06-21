import { validateStringValue } from '../../../command-help/command-help-validators.js';

const ANIMAL_CETACEAN_KEYWORD_DEFINITION = {
  keyword: 'animal.cetacean',
  delegate: {
    type: 'faker',
    target: 'animal.cetacean',
  },
  help: {
    summary: 'Returns a random cetacean species.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
    fakerDocsUrl: 'https://fakerjs.dev/api/animal',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'animal.cetacean',
        sampleReturnValue: 'Guiana Dolphin',
        description: 'Shows the default animal.cetacean call.',
      },
    ],
    args: [],
  },
};

export { ANIMAL_CETACEAN_KEYWORD_DEFINITION };
