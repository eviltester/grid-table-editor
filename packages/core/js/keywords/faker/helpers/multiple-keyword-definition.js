import { validateArrayValue } from '../../../command-help/command-help-validators.js';

const HELPERS_MULTIPLE_KEYWORD_DEFINITION = {
  summary: 'Calls a generator callback multiple times and returns the collected results as an array.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateArrayValue,
  returnType: 'array',
  params: [
    {
      name: 'method',
      optional: false,
      type: '() => unknown',
      description: 'Callback used to generate each array entry.',
    },
    {
      name: 'options',
      optional: true,
      type: 'number | object',
      description: 'Exact count or configuration controlling how many values to generate.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.multiple(() => "sample", { count: 3 })',
      sampleReturnValue: ['sample', 'sample', 'sample'],
      description: 'Shows helpers.multiple collecting three callback results with an explicit count.',
    },
    {
      functionCall: 'helpers.multiple(() => "sample")',
      sampleReturnValue: ['sample', 'sample', 'sample'],
      description: 'Shows helpers.multiple using the default repetition count.',
    },
  ],
};

export { HELPERS_MULTIPLE_KEYWORD_DEFINITION };
