import { validateStringValue } from '../../../command-help/command-help-validators.js';

const INTERNET_EMOJI_KEYWORD_DEFINITION = {
  keyword: 'internet.emoji',
  delegate: {
    type: 'faker',
    target: 'internet.emoji',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random emoji.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.emoji()',
        sampleReturnValue: '🥣',
        description: 'Shows internet.emoji when optional params are omitted.',
      },
      {
        functionCall: 'internet.emoji(types=["food"])',
        sampleReturnValue: '🍲',
        description: 'Shows internet.emoji using types.',
      },
    ],
    args: [
      {
        name: 'types',
        type: 'array',
        required: false,
        description: 'A list of the emoji types that should be used.',
        examples: [['food']],
      },
    ],
  },
};

export { INTERNET_EMOJI_KEYWORD_DEFINITION };
