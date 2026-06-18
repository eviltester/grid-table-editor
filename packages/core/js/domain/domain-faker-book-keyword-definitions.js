import { validateStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_BOOK_KEYWORD_DEFINITIONS = [
  {
    keyword: 'book.author',
    delegate: {
      type: 'faker',
      target: 'book.author',
    },
    help: {
      summary: 'Returns a random author name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/book',
      fakerDocsUrl: 'https://fakerjs.dev/api/book',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'book.author',
          sampleReturnValue: 'Ian McEwan',
          description: 'Shows the default book.author call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/book',
      fakerDocsUrl: 'https://fakerjs.dev/api/book',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'book.format',
          sampleReturnValue: 'Ebook',
          description: 'Shows the default book.format call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/book',
      fakerDocsUrl: 'https://fakerjs.dev/api/book',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'book.genre',
          sampleReturnValue: 'Graphic Novel',
          description: 'Shows the default book.genre call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/book',
      fakerDocsUrl: 'https://fakerjs.dev/api/book',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'book.publisher',
          sampleReturnValue: 'Golden Cockerel Press',
          description: 'Shows the default book.publisher call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/book',
      fakerDocsUrl: 'https://fakerjs.dev/api/book',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'book.series',
          sampleReturnValue: 'The Bartimaeus Trilogy',
          description: 'Shows the default book.series call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/book',
      fakerDocsUrl: 'https://fakerjs.dev/api/book',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'book.title',
          sampleReturnValue: 'Moby Dick',
          description: 'Shows the default book.title call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_BOOK_KEYWORD_DEFINITIONS };
