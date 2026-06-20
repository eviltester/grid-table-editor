import { validateStringValue } from '../../../command-help/command-help-validators.js';

const BOOK_TITLE_KEYWORD_DEFINITION = {
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
};

export { BOOK_TITLE_KEYWORD_DEFINITION };
