import { validateStringValue } from '../../../command-help/command-help-validators.js';

const GIT_COMMIT_ENTRY_KEYWORD_DEFINITION = {
  keyword: 'git.commitEntry',
  delegate: {
    type: 'faker',
    target: 'git.commitEntry',
  },
  help: {
    summary: 'Generates a random commit entry as printed by `git log`.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/git',
    fakerDocsUrl: 'https://fakerjs.dev/api/git',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'git.commitEntry',
        sampleReturnValue:
          'commit f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0af\r\n' +
          'Author: Ricardo Upton <Ricardo.Upton@gmail.com>\r\n' +
          'Date: Wed Jun 17 19:26:37 2026 +0300\r\n' +
          '\r\n' +
          '    parse auxiliary feed\r\n',
        description: 'Shows the default git.commitEntry call.',
      },
    ],
    args: [],
  },
};

export { GIT_COMMIT_ENTRY_KEYWORD_DEFINITION };
