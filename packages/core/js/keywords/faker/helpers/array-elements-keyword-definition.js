import { validateArrayValue } from '../../../command-help/command-help-validators.js';

const HELPERS_ARRAY_ELEMENTS_KEYWORD_DEFINITION = {
  summary: 'Returns multiple random elements from the supplied array.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateArrayValue,
  returnType: 'array',
  params: [
    {
      name: 'array',
      optional: false,
      type: 'array',
      description: 'Array of candidate values to sample from.',
    },
    {
      name: 'count',
      optional: true,
      type: 'number | { min: number; max: number; }',
      description: 'Exact number of items to return, or a min/max range for the returned item count.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.arrayElements(["A", "B", "C"])',
      sampleReturnValue: ['A', 'C'],
      description: 'Shows helpers.arrayElements with only the required array argument.',
    },
    {
      functionCall: 'helpers.arrayElements(["A", "B", "C"], 2)',
      sampleReturnValue: ['C', 'B'],
      description: 'Shows helpers.arrayElements in use.',
    },
    {
      functionCall: 'helpers.arrayElements(["A","B","C"], 5)',
      sampleReturnValue: ['A', 'C', 'B'],
      description: 'Shows helpers.arrayElements using count.',
    },
  ],
};

export { HELPERS_ARRAY_ELEMENTS_KEYWORD_DEFINITION };
