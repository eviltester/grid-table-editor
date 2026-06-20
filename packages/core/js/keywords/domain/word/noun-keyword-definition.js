import { validateStringValue } from '../../../command-help/command-help-validators.js';

const WORD_SELECTION_STRATEGY_TYPE = 'fail|closest|shortest|longest|any-length';

const WORD_NOUN_KEYWORD_DEFINITION = {
  keyword: 'word.noun',
  delegate: {
    type: 'faker',
    target: 'word.noun',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random noun.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/word',
    fakerDocsUrl: 'https://fakerjs.dev/api/word',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'word.noun()',
        sampleReturnValue: 'heating',
        description: 'Shows word.noun when optional params are omitted.',
      },
      {
        functionCall: 'word.noun(length=5)',
        sampleReturnValue: 'humor',
        description: 'Shows word.noun using length.',
      },
      {
        functionCall: 'word.noun(max=5)',
        sampleReturnValue: 'heating',
        description: 'Shows word.noun using max.',
      },
      {
        functionCall: 'word.noun(strategy="any-length")',
        sampleReturnValue: 'heating',
        description: 'Shows word.noun using strategy.',
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
        name: 'max',
        type: 'number',
        required: false,
        description: 'Maximum bound used when generating a value.',
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

export { WORD_NOUN_KEYWORD_DEFINITION };
