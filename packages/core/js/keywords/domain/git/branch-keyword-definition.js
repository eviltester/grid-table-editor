import { validateStringValue } from '../../../command-help/command-help-validators.js';

const GIT_BRANCH_KEYWORD_DEFINITION = {
  keyword: 'git.branch',
  delegate: {
    type: 'faker',
    target: 'git.branch',
  },
  help: {
    summary: 'Generates a random branch name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/git',
    fakerDocsUrl: 'https://fakerjs.dev/api/git',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'git.branch',
        sampleReturnValue: 'firewall-parse',
        description: 'Shows the default git.branch call.',
      },
    ],
    args: [],
  },
};

export { GIT_BRANCH_KEYWORD_DEFINITION };
