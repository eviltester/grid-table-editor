import { validateAnyValue } from '../../../command-help/command-help-validators.js';

const HELPERS_MAYBE_KEYWORD_DEFINITION = {
  summary: 'Calls a callback and returns its value only when faker decides the optional value should be present.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateAnyValue,
  returnType: 'unknown',
  params: [
    {
      name: 'callback',
      optional: false,
      type: '() => unknown',
      description: 'Callback used to generate the value when the optional branch is chosen.',
    },
    {
      name: 'options',
      optional: true,
      type: 'object',
      description: 'Optional configuration controlling probability and fallback behavior.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.maybe(() => "enabled")',
      sampleReturnValue: 'enabled',
      description: 'Shows helpers.maybe using only the callback argument.',
    },
    {
      functionCall: 'helpers.maybe(() => "enabled", { probability: 1 })',
      sampleReturnValue: 'enabled',
      description: 'Shows helpers.maybe forcing the callback branch with an options object.',
    },
  ],
};

export { HELPERS_MAYBE_KEYWORD_DEFINITION };
