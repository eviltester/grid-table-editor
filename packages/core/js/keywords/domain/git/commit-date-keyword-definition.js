import { validateStringValue } from '../../../command-help/command-help-validators.js';

const GIT_COMMIT_DATE_KEYWORD_DEFINITION = {
  keyword: 'git.commitDate',
  delegate: {
    type: 'faker',
    target: 'git.commitDate',
  },
  help: {
    summary: 'Generates a date string for a git commit using the same format as `git log`.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/git',
    fakerDocsUrl: 'https://fakerjs.dev/api/git',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'git.commitDate',
        sampleReturnValue: 'Thu Jun 18 01:55:50 2026 +0600',
        description: 'Shows the default git.commitDate call.',
      },
    ],
    args: [],
  },
};

export { GIT_COMMIT_DATE_KEYWORD_DEFINITION };
