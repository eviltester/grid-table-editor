import { validateStringValue } from '../../../command-help/command-help-validators.js';

const FINANCE_CREDIT_CARD_ISSUER_KEYWORD_DEFINITION = {
  keyword: 'finance.creditCardIssuer',
  delegate: {
    type: 'faker',
    target: 'finance.creditCardIssuer',
  },
  help: {
    summary: 'Returns a random credit card issuer.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.creditCardIssuer',
        sampleReturnValue: 'discover',
        description: 'Shows the default finance.creditCardIssuer call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_CREDIT_CARD_ISSUER_KEYWORD_DEFINITION };
