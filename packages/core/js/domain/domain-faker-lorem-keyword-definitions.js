const DOMAIN_FAKER_LOREM_KEYWORD_DEFINITIONS = [
  {
    keyword: 'lorem.lines',
    delegate: {
      type: 'faker',
      target: 'lorem.lines',
    },
    help: {
      summary: "Generates the given number lines of lorem separated by `'\\n'`.",
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'Illum qui ocer creptio. Antepono aro vergo voluptatem acervus compono apud.',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum bound used when generating a value.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum bound used when generating a value.',
        },
        {
          name: 'lineCount',
          type: 'number',
          required: false,
          description: 'Exact number of lines to generate.',
        },
        {
          name: 'lineCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of lines to generate.',
        },
        {
          name: 'lineCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of lines to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.paragraph',
    delegate: {
      type: 'faker',
      target: 'lorem.paragraph',
    },
    help: {
      summary: 'Generates a paragraph with the given number of sentences.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'Quisquam dolorum modi quae atque.',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum bound used when generating a value.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum bound used when generating a value.',
        },
        {
          name: 'sentenceCount',
          type: 'number',
          required: false,
          description: 'Number of sentences to generate.',
        },
        {
          name: 'sentenceCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of sentences to generate.',
        },
        {
          name: 'sentenceCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of sentences to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.paragraphs',
    delegate: {
      type: 'faker',
      target: 'lorem.paragraphs',
    },
    help: {
      summary: 'Generates the given number of paragraphs.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'Primus paragraphus.\n\nSecundus paragraphus.',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum bound used when generating a value.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum bound used when generating a value.',
        },
        {
          name: 'paragraphCount',
          type: 'number',
          required: false,
          description: 'Number of paragraphs to generate.',
        },
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: 'Separator inserted between generated items.',
        },
        {
          name: 'paragraphCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of paragraphs to generate.',
        },
        {
          name: 'paragraphCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of paragraphs to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.sentence',
    delegate: {
      type: 'faker',
      target: 'lorem.sentence',
    },
    help: {
      summary: 'Generates a space separated list of words beginning with a capital letter and ending with a period.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'Auctor cum deorsum attero cum tergo aut.',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum bound used when generating a value.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum bound used when generating a value.',
        },
        {
          name: 'wordCount',
          type: 'number',
          required: false,
          description: 'Number of words to generate.',
        },
        {
          name: 'wordCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of words to generate.',
        },
        {
          name: 'wordCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of words to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.sentences',
    delegate: {
      type: 'faker',
      target: 'lorem.sentences',
    },
    help: {
      summary: 'Generates the given number of sentences.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'Vicissitudo amet candidus. Urbanus magni carbo artificiose tenus at ambulo.',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum bound used when generating a value.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum bound used when generating a value.',
        },
        {
          name: 'sentenceCount',
          type: 'number',
          required: false,
          description: 'Number of sentences to generate.',
        },
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: 'Separator inserted between generated items.',
        },
        {
          name: 'sentenceCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of sentences to generate.',
        },
        {
          name: 'sentenceCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of sentences to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.slug',
    delegate: {
      type: 'faker',
      target: 'lorem.slug',
    },
    help: {
      summary: 'Generates a slugified text consisting of the given number of hyphen separated words.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'dolore-accusator-atqui',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum bound used when generating a value.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum bound used when generating a value.',
        },
        {
          name: 'wordCount',
          type: 'number',
          required: false,
          description: 'Number of words to generate.',
        },
        {
          name: 'wordCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of words to generate.',
        },
        {
          name: 'wordCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of words to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.text',
    delegate: {
      type: 'faker',
      target: 'lorem.text',
    },
    help: {
      summary: 'Generates a random text based on a random lorem method.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'A short sample text generated from lorem.',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'lorem.word',
    delegate: {
      type: 'faker',
      target: 'lorem.word',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a word of a specified length.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'cumque',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum word length when generating a ranged length.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum word length when generating a ranged length.',
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Exact word length to generate.',
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
    keyword: 'lorem.words',
    delegate: {
      type: 'faker',
      target: 'lorem.words',
    },
    help: {
      summary: 'Generates a space separated list of words.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'desidero conforto decimus',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum bound used when generating a value.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum bound used when generating a value.',
        },
        {
          name: 'wordCount',
          type: 'number',
          required: false,
          description: 'Number of words to generate.',
        },
        {
          name: 'wordCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of words to generate.',
        },
        {
          name: 'wordCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of words to generate.',
        },
      ],
    },
  },
];

export { DOMAIN_FAKER_LOREM_KEYWORD_DEFINITIONS };
