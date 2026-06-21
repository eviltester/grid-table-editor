import { validateStringValue } from '../../../command-help/command-help-validators.js';

const IMAGE_PERSON_PORTRAIT_KEYWORD_DEFINITION = {
  keyword: 'image.personPortrait',
  delegate: {
    type: 'faker',
    target: 'image.personPortrait',
  },
  help: {
    summary: 'Generates a random square portrait (avatar) of a person.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
    fakerDocsUrl: 'https://fakerjs.dev/api/image',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'image.personPortrait',
        sampleReturnValue: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/72.jpg',
        description: 'Shows the default image.personPortrait call.',
      },
    ],
    args: [],
  },
};

export { IMAGE_PERSON_PORTRAIT_KEYWORD_DEFINITION };
