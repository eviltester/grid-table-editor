import { validateUpcValue } from '../../../command-help/command-help-validators.js';

const COMMERCE_UPC_KEYWORD_DEFINITION = {
  keyword: 'commerce.upc',
  delegate: {
    type: 'faker',
    target: 'commerce.upc',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a valid UPC-A (12 digits).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
    fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
    validator: validateUpcValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'commerce.upc()',
        sampleReturnValue: '470310133543',
        description: 'Shows commerce.upc when optional params are omitted.',
      },
      {
        functionCall: 'commerce.upc(prefix="01234")',
        sampleReturnValue: '012344703103',
        description: 'Shows commerce.upc using prefix.',
      },
    ],
    args: [
      {
        name: 'prefix',
        type: 'string',
        required: false,
        description: 'Optional numeric prefix for the UPC body (0-11 digits).',
        examples: ['01234'],
      },
    ],
  },
};

export { COMMERCE_UPC_KEYWORD_DEFINITION };
