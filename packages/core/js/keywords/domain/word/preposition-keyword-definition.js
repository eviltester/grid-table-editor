import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createWordSelectionArgsValidator, WORD_SELECTION_STRATEGY_TYPE } from '../shared/common-arg-validators.js';

const validateWordSelectionArgs = createWordSelectionArgsValidator();

const WORD_PREPOSITION_KEYWORD_DEFINITION = {
  keyword: 'word.preposition',
  delegate: {
    type: 'faker',
    target: 'word.preposition',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random preposition.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/word',
    fakerDocsUrl: 'https://fakerjs.dev/api/word',
    validator: validateStringValue,
    argsValidator: validateWordSelectionArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'word.preposition()',
        sampleReturnValue: 'except',
        description: 'Shows word.preposition when optional params are omitted.',
      },
      {
        functionCall: 'word.preposition(length=5)',
        sampleReturnValue: 'aside',
        description: 'Shows word.preposition using length.',
      },
      {
        functionCall: 'word.preposition(strategy="any-length")',
        sampleReturnValue: 'except',
        description: 'Shows word.preposition using strategy.',
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

export { WORD_PREPOSITION_KEYWORD_DEFINITION };
