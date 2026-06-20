import { validateStringValue } from '../../../command-help/command-help-validators.js';

const BOOK_SERIES_KEYWORD_DEFINITION = {
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
};

export { BOOK_SERIES_KEYWORD_DEFINITION };
