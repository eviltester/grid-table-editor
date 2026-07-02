import { validateAccountNumberValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const validateFinanceAccountNumberArgs = createPositiveIntegerArgsValidator(['length']);

const FINANCE_ACCOUNT_NUMBER_KEYWORD_DEFINITION = {
  keyword: 'finance.accountNumber',
  delegate: {
    type: 'faker',
    target: 'finance.accountNumber',
  },
  help: {
    summary: 'Generates a random account number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateAccountNumberValue,
    argsValidator: validateFinanceAccountNumberArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.accountNumber()',
        sampleReturnValue: '47031013',
        description: 'Shows finance.accountNumber when optional params are omitted.',
      },
      {
        functionCall: 'finance.accountNumber(length=5)',
        sampleReturnValue: '47031',
        description: 'Shows finance.accountNumber using length.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: 'Desired length of the generated value.',
      },
    ],
  },
};

export { FINANCE_ACCOUNT_NUMBER_KEYWORD_DEFINITION };
