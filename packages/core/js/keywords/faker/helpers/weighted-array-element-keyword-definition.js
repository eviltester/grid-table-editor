import { validateAnyValue } from '../../../command-help/command-help-validators.js';

const HELPERS_WEIGHTED_ARRAY_ELEMENT_KEYWORD_DEFINITION = {
  summary: 'Returns one value from a weighted array, favoring entries with higher weights.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateAnyValue,
  returnType: 'unknown',
  params: [
    {
      name: 'array',
      optional: false,
      type: 'array',
      description: 'Array of { weight, value } objects used for weighted selection.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 1, value: "rainy" }])',
      sampleReturnValue: 'sunny',
      description: 'Shows helpers.weightedArrayElement in use.',
    },
  ],
};

export { HELPERS_WEIGHTED_ARRAY_ELEMENT_KEYWORD_DEFINITION };
