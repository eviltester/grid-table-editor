import { validateObjectValue } from '../../../command-help/command-help-validators.js';

const FINANCE_CURRENCY_KEYWORD_DEFINITION = {
  keyword: 'finance.currency',
  delegate: {
    type: 'faker',
    target: 'finance.currency',
  },
  help: {
    summary: 'Returns a random currency object, containing `code`, `name`, `symbol`, and `numericCode` properties.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateObjectValue,
    returnType: 'object',
    usageExamples: [
      {
        functionCall: 'finance.currency',
        sampleReturnValue: {
          name: 'Jordanian Dinar',
          code: 'JOD',
          symbol: '',
          numericCode: '400',
        },
        description: 'Shows the default finance.currency call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_CURRENCY_KEYWORD_DEFINITION };
