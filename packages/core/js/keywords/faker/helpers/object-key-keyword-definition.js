import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HELPERS_OBJECT_KEY_KEYWORD_DEFINITION = {
  summary: 'Returns one random key from the supplied object.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateStringValue,
  returnType: 'string',
  params: [
    {
      name: 'object',
      optional: false,
      type: 'object',
      description: 'Object whose enumerable keys are used as candidate values.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.objectKey({ red: "#f00", blue: "#00f" })',
      sampleReturnValue: 'red',
      description: 'Shows helpers.objectKey in use.',
    },
  ],
};

export { HELPERS_OBJECT_KEY_KEYWORD_DEFINITION };
