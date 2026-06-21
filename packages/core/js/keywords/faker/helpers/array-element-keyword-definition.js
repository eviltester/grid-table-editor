import { validateAnyValue } from '../../../command-help/command-help-validators.js';

const HELPERS_ARRAY_ELEMENT_KEYWORD_DEFINITION = {
  summary: 'Returns one random element from the supplied array.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateAnyValue,
  returnType: 'unknown',
  params: [
    {
      name: 'array',
      optional: false,
      type: 'array',
      description: 'Array of candidate values to choose from.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.arrayElement(["A", "B", "C"])',
      sampleReturnValue: 'B',
      description: 'Shows helpers.arrayElement in use.',
    },
  ],
};

export { HELPERS_ARRAY_ELEMENT_KEYWORD_DEFINITION };
