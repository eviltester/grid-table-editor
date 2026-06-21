import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HELPERS_MUSTACHE_KEYWORD_DEFINITION = {
  summary: 'Replaces {{placeholder}} tokens in a string using values from the supplied data object.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateStringValue,
  returnType: 'string',
  params: [
    {
      name: 'text',
      optional: false,
      type: 'string',
      description: 'Template text containing mustache placeholders such as {{name}}.',
    },
    {
      name: 'data',
      optional: false,
      type: 'object',
      description: 'Object that provides replacement values for the placeholders used in the text.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.mustache("Hello {{name}}", { name: "Ada" })',
      sampleReturnValue: 'Hello Ada',
      description: 'Shows helpers.mustache in use.',
    },
  ],
};

export { HELPERS_MUSTACHE_KEYWORD_DEFINITION };
