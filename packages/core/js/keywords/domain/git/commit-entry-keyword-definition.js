import { validateStringValue } from '../../../command-help/command-help-validators.js';

const GIT_COMMIT_ENTRY_KEYWORD_DEFINITION = {
  keyword: 'git.commitEntry',
  delegate: {
    type: 'faker',
    target: 'git.commitEntry',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random commit entry as printed by `git log`.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/git',
    fakerDocsUrl: 'https://fakerjs.dev/api/git',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'git.commitEntry()',
        sampleReturnValue:
          'commit f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0af\r\n' +
          'Author: Ricardo Upton <Ricardo.Upton@gmail.com>\r\n' +
          'Date: Wed Jun 17 19:26:37 2026 +0300\r\n' +
          '\r\n' +
          '    parse auxiliary feed\r\n',
        description: 'Shows the default git.commitEntry call.',
      },
      {
        functionCall: 'git.commitEntry(merge=true, eol="LF")',
        sampleReturnValue:
          'commit 9f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0a\n' +
          'Merge: fa6b29d 6620e45\n' +
          'Author: Lindsey_Price41 <Lindsey_Price@hotmail.com>\n' +
          'Date: Thu Jun 18 13:36:13 2026 -0800\n' +
          '\n' +
          '    calculate redundant feed\n',
        description: 'Shows git.commitEntry using merge and line-ending options.',
      },
      {
        functionCall: 'git.commitEntry(refDate="2024-01-01T00:00:00.000Z")',
        sampleReturnValue:
          'commit f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0af\r\n' +
          'Author: Ricardo Upton <Ricardo.Upton@gmail.com>\r\n' +
          'Date: Sun Dec 31 03:31:17 2023 +0300\r\n' +
          '\r\n' +
          '    parse auxiliary feed\r\n',
        description: 'Shows git.commitEntry using a reference date.',
      },
      {
        functionCall: 'git.commitEntry(merge=true)',
        sampleReturnValue:
          'commit 9f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0a\r\n' +
          'Merge: fa6b29d 6620e45\r\n' +
          'Author: Lindsey_Price41 <Lindsey_Price@hotmail.com>\r\n' +
          'Date: Thu Jun 18 13:36:13 2026 -0800\r\n' +
          '\r\n' +
          '    calculate redundant feed\r\n',
        description: 'Shows git.commitEntry forcing a merge commit entry.',
      },
      {
        functionCall: 'git.commitEntry(eol="LF")',
        sampleReturnValue:
          'commit f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0af\n' +
          'Author: Ricardo Upton <Ricardo.Upton@gmail.com>\n' +
          'Date: Wed Jun 17 19:26:37 2026 +0300\n' +
          '\n' +
          '    parse auxiliary feed\n',
        description: 'Shows git.commitEntry using LF line endings.',
      },
    ],
    args: [
      {
        name: 'merge',
        type: 'boolean',
        required: false,
        description: 'Whether to generate a merge commit entry.',
        examples: [true],
      },
      {
        name: 'eol',
        type: 'LF|CRLF',
        required: false,
        description: 'Line ending to use in the generated commit entry.',
        examples: ['LF'],
      },
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

export { GIT_COMMIT_ENTRY_KEYWORD_DEFINITION };
