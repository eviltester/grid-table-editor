import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FINANCE_CURRENCY_SYMBOL_KEYWORD_DEFINITION = {
  keyword: 'finance.currencySymbol',
  delegate: {
    type: 'faker',
    target: 'finance.currencySymbol',
  },
  help: {
    summary: 'Returns a random currency symbol.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.currencySymbol',
        sampleReturnValue: 'руб',
        description: 'Shows the default finance.currencySymbol call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_CURRENCY_SYMBOL_KEYWORD_DEFINITION };
