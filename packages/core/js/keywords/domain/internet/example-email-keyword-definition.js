import { validateExampleEmailValue } from '../../../command-help/command-help-validators.js';

const INTERNET_EXAMPLE_EMAIL_KEYWORD_DEFINITION = {
  keyword: 'internet.exampleEmail',
  delegate: {
    type: 'faker',
    target: 'internet.exampleEmail',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates data using faker internet example email.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateExampleEmailValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.exampleEmail()',
        sampleReturnValue: 'Edwin.Dibbert@example.net',
        description: 'Shows the default internet.exampleEmail call.',
      },
      {
        functionCall: 'internet.exampleEmail(firstName="Ada", lastName="Lovelace")',
        sampleReturnValue: 'Ada_Lovelace0@example.net',
        description: 'Shows internet.exampleEmail using firstName and lastName options.',
      },
      {
        functionCall: 'internet.exampleEmail(allowSpecialCharacters=true)',
        sampleReturnValue: 'Edwin.Dibbert@example.net',
        description: 'Shows internet.exampleEmail allowing special characters.',
      },
      {
        functionCall: 'internet.exampleEmail(firstName="Ada")',
        sampleReturnValue: 'Ada.Gutmann9@example.net',
        description: 'Shows internet.exampleEmail using an explicit first name.',
      },
      {
        functionCall: 'internet.exampleEmail(lastName="Lovelace")',
        sampleReturnValue: 'Edwin.Lovelace9@example.net',
        description: 'Shows internet.exampleEmail using an explicit last name.',
      },
    ],
    args: [
      {
        name: 'firstName',
        type: 'string',
        required: false,
        description: 'Optional first name to use as the basis for the email address.',
        examples: ['Ada'],
      },
      {
        name: 'lastName',
        type: 'string',
        required: false,
        description: 'Optional last name to use as the basis for the email address.',
        examples: ['Lovelace'],
      },
      {
        name: 'allowSpecialCharacters',
        type: 'boolean',
        required: false,
        description: 'Whether special characters are allowed in the generated email address.',
        examples: [true],
      },
    ],
  },
};

export { INTERNET_EXAMPLE_EMAIL_KEYWORD_DEFINITION };
