import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HELPERS_FROM_REG_EXP_KEYWORD_DEFINITION = {
  summary: 'Generates a string that matches the supplied regular-expression-style pattern.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateStringValue,
  returnType: 'string',
  params: [
    {
      name: 'pattern',
      optional: false,
      type: 'string | RegExp',
      description: 'Regular expression, or regex-like string, used to generate matching output.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.fromRegExp("[A-Z]{2}[0-9]{2}")',
      sampleReturnValue: 'KS03',
      description: 'Shows helpers.fromRegExp in use.',
    },
  ],
};

export { HELPERS_FROM_REG_EXP_KEYWORD_DEFINITION };
