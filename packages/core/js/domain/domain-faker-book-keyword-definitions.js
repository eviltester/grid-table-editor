const DOMAIN_FAKER_BOOK_KEYWORD_DEFINITIONS = [
  {
    keyword: 'book.author',
    delegate: {
      type: 'faker',
      target: 'book.author',
    },
    help: {
      summary: 'Returns a random author name.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Jacqueline Crooks',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.format',
    delegate: {
      type: 'faker',
      target: 'book.format',
    },
    help: {
      summary: 'Returns a random book format.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Paperback',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.genre',
    delegate: {
      type: 'faker',
      target: 'book.genre',
    },
    help: {
      summary: 'Returns a random genre.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Science Fiction',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.publisher',
    delegate: {
      type: 'faker',
      target: 'book.publisher',
    },
    help: {
      summary: 'Returns a random publisher.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Butterworth-Heinemann',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.series',
    delegate: {
      type: 'faker',
      target: 'book.series',
    },
    help: {
      summary: 'Returns a random series.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'The Inheritance Cycle',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.title',
    delegate: {
      type: 'faker',
      target: 'book.title',
    },
    help: {
      summary: 'Returns a random title.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Animal Farm',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_BOOK_KEYWORD_DEFINITIONS };
