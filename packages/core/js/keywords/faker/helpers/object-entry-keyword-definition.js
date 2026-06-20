import { validateArrayValue } from '../../../command-help/command-help-validators.js';

const HELPERS_OBJECT_ENTRY_KEYWORD_DEFINITION = {
  summary: 'Returns one random [key, value] entry from the supplied object.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateArrayValue,
  returnType: 'array',
  params: [
    {
      name: 'object',
      optional: false,
      type: 'object',
      description: 'Object whose enumerable entries are used as candidate values.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.objectEntry({ red: "#f00", blue: "#00f" })',
      sampleReturnValue: ['red', '#f00'],
      description: 'Shows helpers.objectEntry in use.',
    },
  ],
};

export { HELPERS_OBJECT_ENTRY_KEYWORD_DEFINITION };
