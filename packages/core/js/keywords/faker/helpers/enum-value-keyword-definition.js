import { validateAnyValue } from '../../../command-help/command-help-validators.js';

const HELPERS_ENUM_VALUE_KEYWORD_DEFINITION = {
  summary: 'Returns one random value from the supplied enum-like object.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateAnyValue,
  returnType: 'unknown',
  params: [
    {
      name: 'enumObject',
      optional: false,
      type: 'object',
      description: 'Enum-like object to sample from while ignoring numeric reverse-mapping keys.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.enumValue({ Pending: "pending", Active: "active" })',
      sampleReturnValue: 'pending',
      description: 'Shows helpers.enumValue in use.',
    },
  ],
};

export { HELPERS_ENUM_VALUE_KEYWORD_DEFINITION };
