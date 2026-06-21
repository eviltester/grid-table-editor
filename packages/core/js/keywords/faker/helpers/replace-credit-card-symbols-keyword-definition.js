import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HELPERS_REPLACE_CREDIT_CARD_SYMBOLS_KEYWORD_DEFINITION = {
  summary: 'Replaces credit-card placeholders and computes a valid Luhn checksum for the result.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateStringValue,
  returnType: 'string',
  params: [
    {
      name: 'string',
      optional: true,
      type: 'string',
      description: 'Credit card template containing placeholder symbols such as #, !, and L.',
    },
    {
      name: 'symbol',
      optional: true,
      type: 'string',
      description: 'Replacement symbol to use for digit placeholders instead of the default #.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.replaceCreditCardSymbols()',
      sampleReturnValue: '6453-4703-1013-3546-2807',
      description: 'Shows helpers.replaceCreditCardSymbols with all optional params omitted.',
    },
    {
      functionCall: 'helpers.replaceCreditCardSymbols("1234-[4-9]-##!!-L")',
      sampleReturnValue: '1234-6-7043-6',
      description: 'Shows helpers.replaceCreditCardSymbols using the default placeholder symbols.',
    },
    {
      functionCall: 'helpers.replaceCreditCardSymbols("1234-****-****-L", "*")',
      sampleReturnValue: '1234-4703-1013-1',
      description: 'Shows helpers.replaceCreditCardSymbols using a custom digit placeholder symbol.',
    },
  ],
};

export { HELPERS_REPLACE_CREDIT_CARD_SYMBOLS_KEYWORD_DEFINITION };
