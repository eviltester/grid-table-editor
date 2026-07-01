import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOREM_WORD_STRATEGY_TYPE = 'fail|closest|shortest|longest|any-length';

const LOREM_WORD_KEYWORD_DEFINITION = {
  keyword: 'lorem.word',
  delegate: {
    type: 'faker',
    target: 'lorem.word',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a word of a specified length.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
    fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'lorem.word()',
        sampleReturnValue: 'cur',
        description: 'Shows lorem.word when optional params are omitted.',
      },
      {
        functionCall: 'lorem.word(length=5)',
        sampleReturnValue: 'curvo',
        description: 'Shows lorem.word using length.',
      },
      {
        functionCall: 'lorem.word(strategy="any-length")',
        sampleReturnValue: 'cur',
        description: 'Shows lorem.word using strategy.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: 'Exact word length to generate.',
      },
      {
        name: 'strategy',
        type: LOREM_WORD_STRATEGY_TYPE,
        required: false,
        description:
          'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
      },
    ],
  },
};

export { LOREM_WORD_KEYWORD_DEFINITION };
