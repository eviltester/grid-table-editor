import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FINANCE_CURRENCY_NAME_KEYWORD_DEFINITION = {
  keyword: 'finance.currencyName',
  delegate: {
    type: 'faker',
    target: 'finance.currencyName',
  },
  help: {
    summary: 'Returns a random currency name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.currencyName',
        sampleReturnValue: 'Jordanian Dinar',
        description: 'Shows the default finance.currencyName call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_CURRENCY_NAME_KEYWORD_DEFINITION };
