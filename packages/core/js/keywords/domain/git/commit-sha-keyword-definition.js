import { validateStringValue } from '../../../command-help/command-help-validators.js';

const GIT_COMMIT_SHA_KEYWORD_DEFINITION = {
  keyword: 'git.commitSha',
  delegate: {
    type: 'faker',
    target: 'git.commitSha',
  },
  help: {
    summary: 'Generates a random commit sha.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/git',
    fakerDocsUrl: 'https://fakerjs.dev/api/git',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'git.commitSha',
        sampleReturnValue: '9f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0a',
        description: 'Shows the default git.commitSha call.',
      },
    ],
    args: [],
  },
};

export { GIT_COMMIT_SHA_KEYWORD_DEFINITION };
