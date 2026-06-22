import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createOrderedArgsValidator } from '../../../domain/domain-keyword-arg-validators.js';

const validateFinanceAmountBounds = createOrderedArgsValidator({ lowerName: 'min', upperName: 'max' });

const FINANCE_AMOUNT_KEYWORD_DEFINITION = {
  keyword: 'finance.amount',
  delegate: {
    type: 'faker',
    target: 'finance.amount',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random amount between the given bounds (inclusive).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateStringValue,
    argsValidator: validateFinanceAmountBounds,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.amount()',
        sampleReturnValue: '417.02',
        description: 'Shows finance.amount when optional params are omitted.',
      },
      {
        functionCall: 'finance.amount(autoFormat=true)',
        sampleReturnValue: '417.02',
        description: 'Shows finance.amount using autoFormat.',
      },
      {
        functionCall: 'finance.amount(dec=2)',
        sampleReturnValue: '417.02',
        description: 'Shows finance.amount using dec.',
      },
      {
        functionCall: 'finance.amount(max=100)',
        sampleReturnValue: '41.70',
        description: 'Shows finance.amount using max.',
      },
      {
        functionCall: 'finance.amount(max=10, min=1)',
        sampleReturnValue: '4.75',
        description: 'Shows finance.amount using min.',
      },
      {
        functionCall: 'finance.amount(symbol="$")',
        sampleReturnValue: '$417.02',
        description: 'Shows finance.amount using symbol.',
      },
    ],
    args: [
      {
        name: 'autoFormat',
        type: 'boolean',
        required: false,
        description: 'If true this method will use Number.toLocaleString(). Otherwise it will use Number.toFixed().',
        examples: [true],
      },
      {
        name: 'dec',
        type: 'integer',
        required: false,
        description: 'The number of decimal places for the amount.',
        examples: [2],
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'The upper bound for the amount.',
        examples: [100],
      },
      {
        name: 'min',
        type: 'number',
        required: false,
        description: 'The lower bound for the amount.',
        examples: [1],
      },
      {
        name: 'symbol',
        type: 'string',
        required: false,
        description: 'The symbol used to prefix the amount.',
        examples: ['$'],
      },
    ],
  },
};

export { FINANCE_AMOUNT_KEYWORD_DEFINITION };
