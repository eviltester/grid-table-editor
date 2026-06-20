import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMMERCE_PRODUCT_KEYWORD_DEFINITION = {
  keyword: 'commerce.product',
  delegate: {
    type: 'faker',
    target: 'commerce.product',
  },
  help: {
    summary: 'Returns a short product name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
    fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'commerce.product',
        sampleReturnValue: 'Gloves',
        description: 'Shows the default commerce.product call.',
      },
    ],
    args: [],
  },
};

export { COMMERCE_PRODUCT_KEYWORD_DEFINITION };
