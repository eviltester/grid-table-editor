import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createWordSelectionArgsValidator, WORD_SELECTION_STRATEGY_TYPE } from '../shared/common-arg-validators.js';

const validateWordSelectionArgs = createWordSelectionArgsValidator();

const WORD_ADVERB_KEYWORD_DEFINITION = {
  keyword: 'word.adverb',
  delegate: {
    type: 'faker',
    target: 'word.adverb',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random adverb.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/word',
    fakerDocsUrl: 'https://fakerjs.dev/api/word',
    validator: validateStringValue,
    argsValidator: validateWordSelectionArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'word.adverb()',
        sampleReturnValue: 'knavishly',
        description: 'Shows word.adverb when optional params are omitted.',
      },
      {
        functionCall: 'word.adverb(length=5)',
        sampleReturnValue: 'never',
        description: 'Shows word.adverb using length.',
      },
      {
        functionCall: 'word.adverb(strategy="any-length")',
        sampleReturnValue: 'knavishly',
        description: 'Shows word.adverb using strategy.',
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

export { WORD_ADVERB_KEYWORD_DEFINITION };
