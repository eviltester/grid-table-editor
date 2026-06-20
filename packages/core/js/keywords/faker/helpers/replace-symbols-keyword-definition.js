import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HELPERS_REPLACE_SYMBOLS_KEYWORD_DEFINITION = {
  summary: 'Replaces placeholder symbols such as # and ? in a string with random digits or letters.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateStringValue,
  returnType: 'string',
  params: [
    {
      name: 'string',
      optional: true,
      type: 'string',
      description: 'Template string containing placeholder symbols to replace.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.replaceSymbols("##??-##")',
      sampleReturnValue: '47AH-10',
      description: 'Shows helpers.replaceSymbols in use.',
    },
    {
      functionCall: 'helpers.replaceSymbols()',
      sampleReturnValue: '',
      description: 'Shows helpers.replaceSymbols when optional params are omitted.',
    },
  ],
};

export { HELPERS_REPLACE_SYMBOLS_KEYWORD_DEFINITION };
