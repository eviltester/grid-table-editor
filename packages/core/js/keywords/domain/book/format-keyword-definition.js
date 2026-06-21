import { validateStringValue } from '../../../command-help/command-help-validators.js';

const BOOK_FORMAT_KEYWORD_DEFINITION = {
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
};

export { BOOK_FORMAT_KEYWORD_DEFINITION };
