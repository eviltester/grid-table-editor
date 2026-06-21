import { validateStringValue } from '../../../command-help/command-help-validators.js';

const IMAGE_AVATAR_GIT_HUB_KEYWORD_DEFINITION = {
  keyword: 'image.avatarGitHub',
  delegate: {
    type: 'faker',
    target: 'image.avatarGitHub',
  },
  help: {
    summary: 'Generates a random avatar from GitHub.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
    fakerDocsUrl: 'https://fakerjs.dev/api/image',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'image.avatarGitHub',
        sampleReturnValue: 'https://avatars.githubusercontent.com/u/41702200',
        description: 'Shows the default image.avatarGitHub call.',
      },
    ],
    args: [],
  },
};

export { IMAGE_AVATAR_GIT_HUB_KEYWORD_DEFINITION };
