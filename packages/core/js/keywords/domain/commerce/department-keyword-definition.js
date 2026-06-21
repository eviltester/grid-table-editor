import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMMERCE_DEPARTMENT_KEYWORD_DEFINITION = {
  keyword: 'commerce.department',
  delegate: {
    type: 'faker',
    target: 'commerce.department',
  },
  help: {
    summary: 'Returns a department inside a shop.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/commerce',
    fakerDocsUrl: 'https://fakerjs.dev/api/commerce',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'commerce.department',
        sampleReturnValue: 'Grocery',
        description: 'Shows the default commerce.department call.',
      },
    ],
    args: [],
  },
};

export { COMMERCE_DEPARTMENT_KEYWORD_DEFINITION };
