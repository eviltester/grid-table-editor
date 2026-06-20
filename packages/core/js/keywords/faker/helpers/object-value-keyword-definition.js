import { validateAnyValue } from '../../../command-help/command-help-validators.js';

const HELPERS_OBJECT_VALUE_KEYWORD_DEFINITION = {
  summary: 'Returns one random value from the supplied object.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateAnyValue,
  returnType: 'unknown',
  params: [
    {
      name: 'object',
      optional: false,
      type: 'object',
      description: 'Object whose enumerable values are used as candidate values.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.objectValue({ red: "#f00", blue: "#00f" })',
      sampleReturnValue: '#f00',
      description: 'Shows helpers.objectValue in use.',
    },
  ],
};

export { HELPERS_OBJECT_VALUE_KEYWORD_DEFINITION };
