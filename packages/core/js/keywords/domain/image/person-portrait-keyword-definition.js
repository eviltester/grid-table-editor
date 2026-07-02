import { validateStringValue } from '../../../command-help/command-help-validators.js';

const IMAGE_PERSON_PORTRAIT_KEYWORD_DEFINITION = {
  keyword: 'image.personPortrait',
  delegate: {
    type: 'faker',
    target: 'image.personPortrait',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random square portrait (avatar) of a person.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
    fakerDocsUrl: 'https://fakerjs.dev/api/image',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'image.personPortrait()',
        sampleReturnValue: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/72.jpg',
        description: 'Shows the default image.personPortrait call.',
      },
      {
        functionCall: 'image.personPortrait(sex="female", size=128)',
        sampleReturnValue: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/128/41.jpg',
        description: 'Shows image.personPortrait using sex and size options.',
      },
      {
        functionCall: 'image.personPortrait(sex="female")',
        sampleReturnValue: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/41.jpg',
        description: 'Shows image.personPortrait using a sex category.',
      },
      {
        functionCall: 'image.personPortrait(size=128)',
        sampleReturnValue: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/128/72.jpg',
        description: 'Shows image.personPortrait using an explicit image size.',
      },
    ],
    args: [
      {
        name: 'sex',
        type: 'female|generic|male',
        required: false,
        description: 'Sex category used for the generated portrait.',
        examples: ['female'],
      },
      {
        name: 'size',
        type: '512|256|128|64|32',
        required: false,
        description: 'Square image size in pixels.',
        examples: [128],
      },
    ],
  },
};

export { IMAGE_PERSON_PORTRAIT_KEYWORD_DEFINITION };
