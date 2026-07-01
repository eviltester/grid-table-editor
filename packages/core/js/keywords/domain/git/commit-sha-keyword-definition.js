import { validateStringValue } from '../../../command-help/command-help-validators.js';

const GIT_COMMIT_SHA_KEYWORD_DEFINITION = {
  keyword: 'git.commitSha',
  delegate: {
    type: 'faker',
    target: 'git.commitSha',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random commit sha.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/git',
    fakerDocsUrl: 'https://fakerjs.dev/api/git',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'git.commitSha()',
        sampleReturnValue: '9f0632478b9f4d0e9c34bf6fdd103d29fbf6fc0a',
        description: 'Shows the default git.commitSha call.',
      },
      {
        functionCall: 'git.commitSha(length=7)',
        sampleReturnValue: '9f06324',
        description: 'Shows git.commitSha using a shorter SHA length.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: 'The length of the generated commit SHA.',
        examples: [7],
      },
    ],
  },
};

export { GIT_COMMIT_SHA_KEYWORD_DEFINITION };
