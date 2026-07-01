import { validateStringValue } from '../../../command-help/command-help-validators.js';

const INTERNET_DISPLAY_NAME_KEYWORD_DEFINITION = {
  keyword: 'internet.displayName',
  delegate: {
    type: 'faker',
    target: 'internet.displayName',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: "Generates a display name using the given person's name as base.",
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.displayName()',
        sampleReturnValue: 'Aaliyah.Bosco',
        description: 'Shows the default internet.displayName call.',
      },
      {
        functionCall: 'internet.displayName(firstName="Ada", lastName="Lovelace")',
        sampleReturnValue: 'Ada72',
        description: 'Shows internet.displayName using firstName and lastName options.',
      },
      {
        functionCall: 'internet.displayName(firstName="Ada")',
        sampleReturnValue: 'Ada14',
        description: 'Shows internet.displayName using an explicit first name.',
      },
      {
        functionCall: 'internet.displayName(lastName="Lovelace")',
        sampleReturnValue: 'Aaliyah14',
        description: 'Shows internet.displayName using an explicit last name.',
      },
    ],
    args: [
      {
        name: 'firstName',
        type: 'string',
        required: false,
        description: 'Optional first name to use as the basis for the display name.',
        examples: ['Ada'],
      },
      {
        name: 'lastName',
        type: 'string',
        required: false,
        description: 'Optional last name to use as the basis for the display name.',
        examples: ['Lovelace'],
      },
    ],
  },
};

export { INTERNET_DISPLAY_NAME_KEYWORD_DEFINITION };
