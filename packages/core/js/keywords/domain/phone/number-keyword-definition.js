import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PHONE_NUMBER_STYLE_TYPE = 'human|national|international';

const PHONE_NUMBER_KEYWORD_DEFINITION = {
  keyword: 'phone.number',
  delegate: {
    type: 'faker',
    target: 'phone.number',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random phone number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/phone',
    fakerDocsUrl: 'https://fakerjs.dev/api/phone',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'phone.number()',
        sampleReturnValue: '1-703-301-3354 x628',
        description: 'Shows phone.number when optional params are omitted.',
      },
      {
        functionCall: 'phone.number(style="international")',
        sampleReturnValue: '+15704101335',
        description: 'Shows phone.number using style.',
      },
    ],
    args: [
      {
        name: 'style',
        type: PHONE_NUMBER_STYLE_TYPE,
        required: false,
        description:
          "Style of the generated phone number: 'human': (default) A human-input phone number, e.g. 555-770-7727 or 555.770.7727 x1234 'national': A phone number in a standardized national format, e.g. (555) 123-4567. 'international': A phone number in the E.123 international format, e.g. +15551234567",
        examples: ['international'],
      },
    ],
  },
};

export { PHONE_NUMBER_KEYWORD_DEFINITION };
