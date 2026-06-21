import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMMERCE_PRODUCT_DESCRIPTION_KEYWORD_DEFINITION = {
  keyword: 'commerce.productDescription',
  delegate: {
    type: 'faker',
    target: 'commerce.productDescription',
  },
  help: {
    summary: 'Returns a product description.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
    fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'commerce.productDescription',
        sampleReturnValue: 'New Sausages model with 1 GB RAM, 303 GB storage, and bruised features',
        description: 'Shows the default commerce.productDescription call.',
      },
    ],
    args: [],
  },
};

export { COMMERCE_PRODUCT_DESCRIPTION_KEYWORD_DEFINITION };
