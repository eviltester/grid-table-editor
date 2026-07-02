import { validatePinValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const validateFinancePinArgs = createPositiveIntegerArgsValidator(['length']);

const FINANCE_PIN_KEYWORD_DEFINITION = {
  keyword: 'finance.pin',
  delegate: {
    type: 'faker',
    target: 'finance.pin',
  },
  help: {
    summary: 'Generates a random PIN number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validatePinValue,
    argsValidator: validateFinancePinArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.pin()',
        sampleReturnValue: '4703',
        description: 'Shows finance.pin when optional params are omitted.',
      },
      {
        functionCall: 'finance.pin(length=5)',
        sampleReturnValue: '47031',
        description: 'Shows finance.pin using length.',
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

export { FINANCE_PIN_KEYWORD_DEFINITION };
