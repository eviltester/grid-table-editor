import { validateStringValue } from '../command-help/command-help-validators.js';

const WORD_SELECTION_STRATEGY_TYPE = 'fail|closest|shortest|longest|any-length';

const DOMAIN_FAKER_WORD_KEYWORD_DEFINITIONS = [
  {
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
          functionCall: 'word.adjective(max=5)',
          sampleReturnValue: 'inferior',
          description: 'Shows word.adjective using max.',
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
  },
  {
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
          functionCall: 'word.adverb(max=5)',
          sampleReturnValue: 'knavishly',
          description: 'Shows word.adverb using max.',
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
  },
  {
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
          functionCall: 'word.conjunction(max=5)',
          sampleReturnValue: 'likewise',
          description: 'Shows word.conjunction using max.',
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
  },
  {
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
          functionCall: 'word.interjection(max=5)',
          sampleReturnValue: 'woot',
          description: 'Shows word.interjection using max.',
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
  },
  {
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
  },
  {
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
          functionCall: 'word.preposition(max=5)',
          sampleReturnValue: 'except',
          description: 'Shows word.preposition using max.',
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
  },
  {
    keyword: 'word.sample',
    delegate: {
      type: 'faker',
      target: 'word.sample',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Returns a random word, that can be an adjective, adverb, conjunction, interjection, noun, preposition, or verb.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/word',
      fakerDocsUrl: 'https://fakerjs.dev/api/word',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'word.sample()',
          sampleReturnValue: 'boohoo',
          description: 'Shows word.sample when optional params are omitted.',
        },
        {
          functionCall: 'word.sample(length=5)',
          sampleReturnValue: 'yowza',
          description: 'Shows word.sample using length.',
        },
        {
          functionCall: 'word.sample(max=5)',
          sampleReturnValue: 'boohoo',
          description: 'Shows word.sample using max.',
        },
        {
          functionCall: 'word.sample(strategy="any-length")',
          sampleReturnValue: 'boohoo',
          description: 'Shows word.sample using strategy.',
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
  },
  {
    keyword: 'word.verb',
    delegate: {
      type: 'faker',
      target: 'word.verb',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random verb.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/word',
      fakerDocsUrl: 'https://fakerjs.dev/api/word',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'word.verb()',
          sampleReturnValue: 'hunger',
          description: 'Shows word.verb when optional params are omitted.',
        },
        {
          functionCall: 'word.verb(length=5)',
          sampleReturnValue: 'mould',
          description: 'Shows word.verb using length.',
        },
        {
          functionCall: 'word.verb(max=5)',
          sampleReturnValue: 'hunger',
          description: 'Shows word.verb using max.',
        },
        {
          functionCall: 'word.verb(strategy="any-length")',
          sampleReturnValue: 'hunger',
          description: 'Shows word.verb using strategy.',
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
  },
  {
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
  },
];

export { DOMAIN_FAKER_WORD_KEYWORD_DEFINITIONS };
