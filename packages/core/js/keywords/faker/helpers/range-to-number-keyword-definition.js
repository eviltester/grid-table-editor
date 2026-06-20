import { validateNumberValue } from '../../../command-help/command-help-validators.js';

const HELPERS_RANGE_TO_NUMBER_KEYWORD_DEFINITION = {
  summary: 'Converts a number or { min, max } range into a concrete number.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateNumberValue,
  returnType: 'number',
  params: [
    {
      name: 'numberOrRange',
      optional: false,
      type: 'number | { min: number; max: number; }',
      description: 'Fixed number or range object to resolve into a single numeric value.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.rangeToNumber({ min: 1, max: 2 })',
      sampleReturnValue: 1,
      description: 'Shows helpers.rangeToNumber in use.',
    },
  ],
};

export { HELPERS_RANGE_TO_NUMBER_KEYWORD_DEFINITION };
