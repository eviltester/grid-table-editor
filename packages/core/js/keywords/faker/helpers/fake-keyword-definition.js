import { validateStringValue } from '../../../command-help/command-help-validators.js';

const HELPERS_FAKE_KEYWORD_DEFINITION = {
  summary: 'Interpolates faker template placeholders inside a string and returns the rendered result.',
  docsUrl: 'https://fakerjs.dev/api/helpers',
  validator: validateStringValue,
  returnType: 'string',
  params: [
    {
      name: 'pattern',
      optional: false,
      type: 'string',
      description: 'Template string containing faker placeholders such as {{person.firstName}} or {{location.city}}.',
    },
  ],
  usageExamples: [
    {
      functionCall: 'helpers.fake("Hi, my name is {{person.firstName}} {{person.lastName}}!")',
      sampleReturnValue: 'Hi, my name is Aaliyah Bosco!',
      description: 'Shows helpers.fake in use.',
    },
  ],
};

export { HELPERS_FAKE_KEYWORD_DEFINITION };
