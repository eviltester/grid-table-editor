import { validateIsbnValue } from '../../../command-help/command-help-validators.js';

const COMMERCE_ISBN_KEYWORD_DEFINITION = {
  keyword: 'commerce.isbn',
  delegate: {
    type: 'faker',
    target: 'commerce.isbn',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random ISBN identifier.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
    fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
    validator: validateIsbnValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'commerce.isbn()',
        sampleReturnValue: '978-0-7031-0133-4',
        description: 'Shows commerce.isbn when optional params are omitted.',
      },
      {
        functionCall: 'commerce.isbn(separator="-")',
        sampleReturnValue: '978-0-7031-0133-4',
        description: 'Shows commerce.isbn using separator.',
      },
      {
        functionCall: 'commerce.isbn(variant=10)',
        sampleReturnValue: '0-7031-0133-1',
        description: 'Shows commerce.isbn using variant.',
      },
    ],
    args: [
      {
        name: 'separator',
        type: 'string',
        required: false,
        description: 'Separator inserted between generated items.',
      },
      {
        name: 'variant',
        type: '10|13',
        required: false,
        description: 'ISBN length variant: use 10 for ISBN-10 or 13 for ISBN-13.',
      },
    ],
  },
};

export { COMMERCE_ISBN_KEYWORD_DEFINITION };
