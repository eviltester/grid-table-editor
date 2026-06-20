import { validateStringValue } from '../../../command-help/command-help-validators.js';

const BOOK_GENRE_KEYWORD_DEFINITION = {
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
};

export { BOOK_GENRE_KEYWORD_DEFINITION };
