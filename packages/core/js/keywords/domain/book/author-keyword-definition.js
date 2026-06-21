import { validateStringValue } from '../../../command-help/command-help-validators.js';

const BOOK_AUTHOR_KEYWORD_DEFINITION = {
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
};

export { BOOK_AUTHOR_KEYWORD_DEFINITION };
