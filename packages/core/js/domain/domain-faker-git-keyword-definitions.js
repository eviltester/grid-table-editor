const DOMAIN_FAKER_GIT_KEYWORD_DEFINITIONS = [
  {
    keyword: 'git.branch',
    delegate: {
      type: 'faker',
      target: 'git.branch',
    },
    help: {
      summary: 'Generates a random branch name.',
      docsUrl: 'https://fakerjs.dev/api/git',
      example: 'array-compress',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/git',
      example: 'Tue Apr 28 04:28:58 2026 -0600',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/git',
      example: 'commit 4f9a2d1c Author: Alex Example <alex@example.com> Date: Tue May 19 2026',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/git',
      example: 'reboot cross-platform system',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/git',
      example: '3418f0e64e8eae52ebd67b11d98e571fd6a81017',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_GIT_KEYWORD_DEFINITIONS };
