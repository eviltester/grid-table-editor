import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const WORD_SELECTION_STRATEGY_TYPE = 'fail|closest|shortest|longest|any-length';
const validateWordSelectionArgs = createPositiveIntegerArgsValidator(['length']);

const WORD_INTERJECTION_KEYWORD_DEFINITION = {
  keyword: 'word.interjection',
  delegate: {
    type: 'faker',
    target: 'word.interjection',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random interjection.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/word',
    fakerDocsUrl: 'https://fakerjs.dev/api/word',
    validator: validateStringValue,
    argsValidator: validateWordSelectionArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'word.interjection()',
        sampleReturnValue: 'woot',
        description: 'Shows word.interjection when optional params are omitted.',
      },
      {
        functionCall: 'word.interjection(length=5)',
        sampleReturnValue: 'fooey',
        description: 'Shows word.interjection using length.',
      },
      {
        functionCall: 'word.interjection(strategy="any-length")',
        sampleReturnValue: 'woot',
        description: 'Shows word.interjection using strategy.',
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

export { WORD_INTERJECTION_KEYWORD_DEFINITION };
