import { validateStringValue } from '../../../command-help/command-help-validators.js';

const BOOK_PUBLISHER_KEYWORD_DEFINITION = {
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
};

export { BOOK_PUBLISHER_KEYWORD_DEFINITION };
