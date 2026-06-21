import { validateStringValue } from '../../../command-help/command-help-validators.js';

const GIT_COMMIT_MESSAGE_KEYWORD_DEFINITION = {
  keyword: 'git.commitMessage',
  delegate: {
    type: 'faker',
    target: 'git.commitMessage',
  },
  help: {
    summary: 'Generates a random commit message.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/git',
    fakerDocsUrl: 'https://fakerjs.dev/api/git',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'git.commitMessage',
        sampleReturnValue: 'hack optical alarm',
        description: 'Shows the default git.commitMessage call.',
      },
    ],
    args: [],
  },
};

export { GIT_COMMIT_MESSAGE_KEYWORD_DEFINITION };
