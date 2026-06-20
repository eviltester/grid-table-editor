import { validateStringValue } from '../../../command-help/command-help-validators.js';

const INTERNET_USERNAME_KEYWORD_DEFINITION = {
  keyword: 'internet.username',
  delegate: {
    type: 'faker',
    target: 'internet.username',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: "Generates a username using the given person's name as base.",
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.username()',
        sampleReturnValue: 'Aaliyah.Bosco',
        description: 'Shows internet.username when optional params are omitted.',
      },
      {
        functionCall: 'internet.username(firstName="Ada")',
        sampleReturnValue: 'Ada.Abbott14',
        description: 'Shows internet.username using firstName.',
      },
      {
        functionCall: 'internet.username(lastName="Lovelace")',
        sampleReturnValue: 'Aaliyah.Lovelace14',
        description: 'Shows internet.username using lastName.',
      },
    ],
    args: [
      {
        name: 'firstName',
        type: 'string',
        required: false,
        description: 'The optional first name to use.',
      },
      {
        name: 'lastName',
        type: 'string',
        required: false,
        description: 'The optional last name to use.',
      },
    ],
  },
};

export { INTERNET_USERNAME_KEYWORD_DEFINITION };
