import { validateStringValue } from '../../../command-help/command-help-validators.js';

const GIT_COMMIT_DATE_KEYWORD_DEFINITION = {
  keyword: 'git.commitDate',
  delegate: {
    type: 'faker',
    target: 'git.commitDate',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a date string for a git commit using the same format as `git log`.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/git',
    fakerDocsUrl: 'https://fakerjs.dev/api/git',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'git.commitDate()',
        sampleReturnValue: 'Thu Jun 18 01:55:50 2026 +0600',
        description: 'Shows the default git.commitDate call.',
      },
      {
        functionCall: 'git.commitDate(refDate="2024-01-01T00:00:00.000Z")',
        sampleReturnValue: 'Sun Dec 31 10:00:30 2023 +0600',
        description: 'Shows git.commitDate using a reference date.',
      },
    ],
    args: [
      {
        name: 'refDate',
        type: 'string|date|number',
        required: false,
        description: 'The date to use as reference point for generated commit dates.',
        examples: ['2024-01-01T00:00:00.000Z'],
      },
    ],
  },
};

export { GIT_COMMIT_DATE_KEYWORD_DEFINITION };
