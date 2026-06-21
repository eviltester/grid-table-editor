import { validateCreditCardCvvValue } from '../../../command-help/command-help-validators.js';

const FINANCE_CREDIT_CARD_CVV_KEYWORD_DEFINITION = {
  keyword: 'finance.creditCardCVV',
  delegate: {
    type: 'faker',
    target: 'finance.creditCardCVV',
  },
  help: {
    summary: 'Generates a random credit card CVV.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateCreditCardCvvValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.creditCardCVV',
        sampleReturnValue: '470',
        description: 'Shows the default finance.creditCardCVV call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_CREDIT_CARD_CVV_KEYWORD_DEFINITION };
