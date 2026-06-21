import { validateCurrencyNumericCodeValue } from '../../../command-help/command-help-validators.js';

const FINANCE_CURRENCY_NUMERIC_CODE_KEYWORD_DEFINITION = {
  keyword: 'finance.currencyNumericCode',
  delegate: {
    type: 'faker',
    target: 'finance.currencyNumericCode',
  },
  help: {
    summary: 'Returns a random currency numeric code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateCurrencyNumericCodeValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.currencyNumericCode',
        sampleReturnValue: '400',
        description: 'Shows the default finance.currencyNumericCode call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_CURRENCY_NUMERIC_CODE_KEYWORD_DEFINITION };
