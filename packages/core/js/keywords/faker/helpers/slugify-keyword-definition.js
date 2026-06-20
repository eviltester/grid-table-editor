import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HELPERS_SLUGIFY_KEYWORD_DEFINITION = {
  summary: 'Converts a string into a URL-friendly slug.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateStringValue,
  returnType: 'string',
  params: [
    {
      name: 'string',
      optional: true,
      type: 'string',
      description: 'Input text to normalize into a lowercase, hyphen-separated slug.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.slugify("Hello World 2026")',
      sampleReturnValue: 'Hello-World-2026',
      description: 'Shows helpers.slugify in use.',
    },
    {
      functionCall: 'helpers.slugify()',
      sampleReturnValue: '',
      description: 'Shows helpers.slugify when optional params are omitted.',
    },
  ],
};

export { HELPERS_SLUGIFY_KEYWORD_DEFINITION };
