import { validateBicValue } from '../../../command-help/command-help-validators.js';

const FINANCE_BIC_KEYWORD_DEFINITION = {
  keyword: 'finance.bic',
  delegate: {
    type: 'faker',
    target: 'finance.bic',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random SWIFT/BIC code based on the ISO-9362 format.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateBicValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.bic()',
        sampleReturnValue: 'SAHDBI6CJFO',
        description: 'Shows finance.bic when optional params are omitted.',
      },
      {
        functionCall: 'finance.bic(includeBranchCode=true)',
        sampleReturnValue: 'KSAHBZ36EJF',
        description: 'Shows finance.bic using includeBranchCode.',
      },
    ],
    args: [
      {
        name: 'includeBranchCode',
        type: 'boolean',
        required: false,
        description: 'Whether to include a three-digit branch code at the end of the generated code.',
      },
    ],
  },
};

export { FINANCE_BIC_KEYWORD_DEFINITION };
