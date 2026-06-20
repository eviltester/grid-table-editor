import { validateCurrencyCodeValue } from '../../../command-help/command-help-validators.js';

const FINANCE_CURRENCY_CODE_KEYWORD_DEFINITION = {
  keyword: 'finance.currencyCode',
  delegate: {
    type: 'faker',
    target: 'finance.currencyCode',
  },
  help: {
    summary: 'Returns a random currency code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateCurrencyCodeValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.currencyCode',
        sampleReturnValue: 'JOD',
        description: 'Shows the default finance.currencyCode call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_CURRENCY_CODE_KEYWORD_DEFINITION };
