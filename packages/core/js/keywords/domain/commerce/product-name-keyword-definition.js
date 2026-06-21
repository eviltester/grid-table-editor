import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMMERCE_PRODUCT_NAME_KEYWORD_DEFINITION = {
  keyword: 'commerce.productName',
  delegate: {
    type: 'faker',
    target: 'commerce.productName',
  },
  help: {
    summary: 'Generates a random descriptive product name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
    fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'commerce.productName',
        sampleReturnValue: 'Handmade Plastic Bacon',
        description: 'Shows the default commerce.productName call.',
      },
    ],
    args: [],
  },
};

export { COMMERCE_PRODUCT_NAME_KEYWORD_DEFINITION };
