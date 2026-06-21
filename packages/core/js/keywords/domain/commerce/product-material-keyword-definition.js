import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMMERCE_PRODUCT_MATERIAL_KEYWORD_DEFINITION = {
  keyword: 'commerce.productMaterial',
  delegate: {
    type: 'faker',
    target: 'commerce.productMaterial',
  },
  help: {
    summary: 'Returns a material of a product.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
    fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'commerce.productMaterial',
        sampleReturnValue: 'Gold',
        description: 'Shows the default commerce.productMaterial call.',
      },
    ],
    args: [],
  },
};

export { COMMERCE_PRODUCT_MATERIAL_KEYWORD_DEFINITION };
