import { validateStringValue } from '../../../command-help/command-help-validators.js';

const WORD_SELECTION_STRATEGY_TYPE = 'fail|closest|shortest|longest|any-length';

const WORD_CONJUNCTION_KEYWORD_DEFINITION = {
  keyword: 'word.conjunction',
  delegate: {
    type: 'faker',
    target: 'word.conjunction',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random conjunction.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/word',
    fakerDocsUrl: 'https://fakerjs.dev/api/word',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'word.conjunction()',
        sampleReturnValue: 'likewise',
        description: 'Shows word.conjunction when optional params are omitted.',
      },
      {
        functionCall: 'word.conjunction(length=5)',
        sampleReturnValue: 'until',
        description: 'Shows word.conjunction using length.',
      },
      {
        functionCall: 'word.conjunction(strategy="any-length")',
        sampleReturnValue: 'likewise',
        description: 'Shows word.conjunction using strategy.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: 'Desired length of the generated value.',
      },
      {
        name: 'strategy',
        type: WORD_SELECTION_STRATEGY_TYPE,
        required: false,
        description:
          'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
      },
    ],
  },
};

export { WORD_CONJUNCTION_KEYWORD_DEFINITION };
