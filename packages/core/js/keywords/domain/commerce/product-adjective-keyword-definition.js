import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMMERCE_PRODUCT_ADJECTIVE_KEYWORD_DEFINITION = {
  keyword: 'commerce.productAdjective',
  delegate: {
    type: 'faker',
    target: 'commerce.productAdjective',
  },
  help: {
    summary: 'Returns an adjective describing a product.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
    fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'commerce.productAdjective',
        sampleReturnValue: 'Handmade',
        description: 'Shows the default commerce.productAdjective call.',
      },
    ],
    args: [],
  },
};

export { COMMERCE_PRODUCT_ADJECTIVE_KEYWORD_DEFINITION };
