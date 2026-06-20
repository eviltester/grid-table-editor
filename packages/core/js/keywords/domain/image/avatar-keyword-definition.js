import { validateStringValue } from '../../../command-help/command-help-validators.js';

const IMAGE_AVATAR_KEYWORD_DEFINITION = {
  keyword: 'image.avatar',
  delegate: {
    type: 'faker',
    target: 'image.avatar',
  },
  help: {
    summary: 'Generates a random avatar image url.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
    fakerDocsUrl: 'https://fakerjs.dev/api/image',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'image.avatar',
        sampleReturnValue: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/0.jpg',
        description: 'Shows the default image.avatar call.',
      },
    ],
    args: [],
  },
};

export { IMAGE_AVATAR_KEYWORD_DEFINITION };
