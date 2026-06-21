import { validateStringValue } from '../../../command-help/command-help-validators.js';

const INTERNET_PASSWORD_KEYWORD_DEFINITION = {
  keyword: 'internet.password',
  delegate: {
    type: 'faker',
    target: 'internet.password',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary:
      'Generates a random password-like string. Do not use this method for generating actual passwords for users.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.password()',
        sampleReturnValue: 'He2AFTHb4tHV3mb',
        description: 'Shows internet.password with all optional params omitted.',
      },
      {
        functionCall: 'internet.password(length=12)',
        sampleReturnValue: 'He2AFTHb4tHV',
        description: 'Shows internet.password using only a custom length.',
      },
      {
        functionCall: 'internet.password(memorable=true)',
        sampleReturnValue: 'hefutisawetikub',
        description: 'Shows internet.password using only the memorable flag.',
      },
      {
        functionCall: 'internet.password(length=12, memorable=true)',
        sampleReturnValue: 'hefutisaweti',
        description: 'Shows internet.password generating a memorable password-like string.',
      },
      {
        functionCall: 'internet.password(pattern="[A-Z]")',
        sampleReturnValue: 'HAFTHHVISKOWXHH',
        description: 'Shows internet.password constrained only by a regex-style pattern.',
      },
      {
        functionCall: 'internet.password(length=12, memorable=false, pattern="[A-Z]")',
        sampleReturnValue: 'HAFTHHVISKOW',
        description: 'Shows internet.password constrained by a regex-style pattern.',
      },
      {
        functionCall: 'internet.password(prefix="#")',
        sampleReturnValue: '#He2AFTHb4tHV3m',
        description: 'Shows internet.password using only the prefix option.',
      },
      {
        functionCall: 'internet.password(length=12, memorable=false, pattern="[A-Z]", prefix="#")',
        sampleReturnValue: '#HAFTHHVISKO',
        description: 'Shows internet.password using length, pattern, and prefix together.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'integer',
        required: false,
        description: 'The length of the password to generate.',
        examples: [12],
      },
      {
        name: 'memorable',
        type: 'boolean',
        required: false,
        description: 'Whether the generated password should be memorable.',
        examples: [true],
      },
      {
        name: 'pattern',
        type: 'regexp',
        required: false,
        description: 'The pattern that all chars should match. This option will be ignored, if memorable is true.',
        examples: ['[A-Z]'],
      },
      {
        name: 'prefix',
        type: 'string',
        required: false,
        description: 'The prefix to use.',
        examples: ['#'],
      },
    ],
  },
};

export { INTERNET_PASSWORD_KEYWORD_DEFINITION };
