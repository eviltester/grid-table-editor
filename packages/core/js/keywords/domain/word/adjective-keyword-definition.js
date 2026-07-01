import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const WORD_SELECTION_STRATEGY_TYPE = 'fail|closest|shortest|longest|any-length';
const validateWordSelectionArgs = createPositiveIntegerArgsValidator(['length']);

const WORD_ADJECTIVE_KEYWORD_DEFINITION = {
  keyword: 'word.adjective',
  delegate: {
    type: 'faker',
    target: 'word.adjective',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random adjective.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/word',
    fakerDocsUrl: 'https://fakerjs.dev/api/word',
    validator: validateStringValue,
    argsValidator: validateWordSelectionArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'word.adjective()',
        sampleReturnValue: 'inferior',
        description: 'Shows word.adjective when optional params are omitted.',
      },
      {
        functionCall: 'word.adjective(length=5)',
        sampleReturnValue: 'major',
        description: 'Shows word.adjective using length.',
      },
      {
        functionCall: 'word.adjective(strategy="any-length")',
        sampleReturnValue: 'inferior',
        description: 'Shows word.adjective using strategy.',
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

export { WORD_ADJECTIVE_KEYWORD_DEFINITION };
