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
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'heavenly',
      returnType: 'string',
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
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'selfishly',
      returnType: 'string',
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
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'indeed',
      returnType: 'string',
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
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'er',
      returnType: 'string',
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
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'cook',
      returnType: 'string',
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
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'beside',
      returnType: 'string',
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
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'snoopy',
      returnType: 'string',
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
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'embalm',
      returnType: 'string',
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
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'geez',
      returnType: 'string',
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
