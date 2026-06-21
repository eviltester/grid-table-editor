import { validateCreditCardNumberValue } from '../../../command-help/command-help-validators.js';

const FINANCE_CREDIT_CARD_NUMBER_KEYWORD_DEFINITION = {
  keyword: 'finance.creditCardNumber',
  delegate: {
    type: 'faker',
    target: 'finance.creditCardNumber',
  },
  help: {
    summary: 'Generates a random credit card number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateCreditCardNumberValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.creditCardNumber()',
        sampleReturnValue: '6503-1013-3546-2805',
        description: 'Shows finance.creditCardNumber when optional params are omitted.',
      },
      {
        functionCall: 'finance.creditCardNumber(issuer="Visa")',
        sampleReturnValue: '4703101335466',
        description: 'Shows finance.creditCardNumber using issuer.',
      },
    ],
    args: [
      {
        name: 'issuer',
        type: 'string',
        required: false,
        description: 'Issuer or provider value used to constrain generated output.',
      },
    ],
  },
};

export { FINANCE_CREDIT_CARD_NUMBER_KEYWORD_DEFINITION };
