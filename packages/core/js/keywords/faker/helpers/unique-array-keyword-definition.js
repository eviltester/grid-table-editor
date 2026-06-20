import { validateArrayValue } from '../../../command-help/command-help-validators.js';

const HELPERS_UNIQUE_ARRAY_KEYWORD_DEFINITION = {
  summary: 'Builds an array of unique values by repeatedly sampling a source until the requested length is reached.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateArrayValue,
  returnType: 'array',
  params: [
    {
      name: 'source',
      optional: false,
      type: 'array | () => unknown',
      description: 'Array of possible values or a callback used to generate candidate values.',
    },
    {
      name: 'length',
      optional: false,
      type: 'number',
      description: 'Number of unique values to return.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.uniqueArray(["red", "green", "blue"], 2)',
      sampleReturnValue: ['red', 'blue'],
      description: 'Shows helpers.uniqueArray in use.',
    },
  ],
};

export { HELPERS_UNIQUE_ARRAY_KEYWORD_DEFINITION };
