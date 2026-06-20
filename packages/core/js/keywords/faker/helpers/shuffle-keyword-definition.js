import { validateArrayValue } from '../../../command-help/command-help-validators.js';

const HELPERS_SHUFFLE_KEYWORD_DEFINITION = {
  summary: 'Returns a shuffled copy of the supplied array.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateArrayValue,
  returnType: 'array',
  params: [
    {
      name: 'array',
      optional: false,
      type: 'array',
      description: 'Array of values to shuffle.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.shuffle(["A", "B", "C"])',
      sampleReturnValue: ['A', 'C', 'B'],
      description: 'Shows helpers.shuffle in use.',
    },
  ],
};

export { HELPERS_SHUFFLE_KEYWORD_DEFINITION };
