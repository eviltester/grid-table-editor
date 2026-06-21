import { validateEmailValue } from '../../../command-help/command-help-validators.js';

const INTERNET_EMAIL_KEYWORD_DEFINITION = {
  keyword: 'internet.email',
  delegate: {
    type: 'faker',
    target: 'internet.email',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates data using faker internet email.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateEmailValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.email()',
        sampleReturnValue: 'Edwin.Dibbert@hotmail.com',
        description: 'Shows internet.email when optional params are omitted.',
      },
      {
        functionCall: 'internet.email(allowSpecialCharacters=true)',
        sampleReturnValue: 'Edwin.Dibbert@hotmail.com',
        description: 'Shows internet.email using allowSpecialCharacters.',
      },
      {
        functionCall: 'internet.email(firstName="Ada")',
        sampleReturnValue: 'Ada.Gutmann9@hotmail.com',
        description: 'Shows internet.email using firstName.',
      },
      {
        functionCall: 'internet.email(lastName="Lovelace")',
        sampleReturnValue: 'Edwin.Lovelace9@hotmail.com',
        description: 'Shows internet.email using lastName.',
      },
      {
        functionCall: 'internet.email(provider="example.com")',
        sampleReturnValue: 'Aaliyah.Bosco@example.com',
        description: 'Shows internet.email using provider.',
      },
    ],
    args: [
      {
        name: 'allowSpecialCharacters',
        type: 'boolean',
        required: false,
        description: "Whether special characters such as .!#$%&'*+-/=?^_`{|}~ should be included in the email address.",
      },
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
      {
        name: 'provider',
        type: 'string',
        required: false,
        description: 'The mail provider domain to use. If not specified, a random free mail provider will be chosen.',
      },
    ],
  },
};

export { INTERNET_EMAIL_KEYWORD_DEFINITION };
