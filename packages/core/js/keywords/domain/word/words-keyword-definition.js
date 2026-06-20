import { validateStringValue } from '../../../command-help/command-help-validators.js';

const WORD_WORDS_KEYWORD_DEFINITION = {
  keyword: 'word.words',
  delegate: {
    type: 'faker',
    target: 'word.words',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random string containing some words separated by spaces.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/word',
    fakerDocsUrl: 'https://fakerjs.dev/api/word',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'word.words()',
        sampleReturnValue: 'fog aboard',
        description: 'Shows word.words when optional params are omitted.',
      },
      {
        functionCall: 'word.words(count=5)',
        sampleReturnValue: 'boohoo pish tenderly above pop',
        description: 'Shows word.words using count.',
      },
      {
        functionCall: 'word.words(max=5)',
        sampleReturnValue: 'fog aboard',
        description: 'Shows word.words using max.',
      },
    ],
    args: [
      {
        name: 'count',
        type: 'number',
        required: false,
        description: 'Number of items to generate.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'Maximum bound used when generating a value.',
      },
    ],
  },
};

export { WORD_WORDS_KEYWORD_DEFINITION };
