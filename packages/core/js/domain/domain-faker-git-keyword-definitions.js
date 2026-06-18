import { validateStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_GIT_KEYWORD_DEFINITIONS = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

export { DOMAIN_FAKER_GIT_KEYWORD_DEFINITIONS };
