import { validateIbanValue } from '../../../command-help/command-help-validators.js';

const FINANCE_IBAN_KEYWORD_DEFINITION = {
  keyword: 'finance.iban',
  delegate: {
    type: 'faker',
    target: 'finance.iban',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random IBAN.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateIbanValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.iban()',
        sampleReturnValue: 'IE39SAHD00454601410936',
        description: 'Shows finance.iban when optional params are omitted.',
      },
      {
        functionCall: 'finance.iban(countryCode="GB")',
        sampleReturnValue: 'GB98KSAH00235420410936',
        description: 'Shows finance.iban using countryCode.',
      },
      {
        functionCall: 'finance.iban(formatted=true)',
        sampleReturnValue: 'IE39 SAHD 0045 4601 4109 36',
        description: 'Shows finance.iban using formatted.',
      },
    ],
    args: [
      {
        name: 'countryCode',
        type: 'string',
        required: false,
        description:
          'The country code from which you want to generate an IBAN, if none is provided a random country will be used.',
        examples: ['GB'],
      },
      {
        name: 'formatted',
        type: 'boolean',
        required: false,
        description: 'Return a formatted version of the generated IBAN.',
        examples: [true],
      },
    ],
  },
};

export { FINANCE_IBAN_KEYWORD_DEFINITION };
