import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_FULL_NAME_KEYWORD_DEFINITION = {
  keyword: 'person.fullName',
  delegate: {
    type: 'faker',
    target: 'person.fullName',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random full name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.fullName()',
        sampleReturnValue: 'Aaliyah Corkery',
        description: 'Shows the default person.fullName call.',
      },
      {
        functionCall: 'person.fullName(firstName="Ada", lastName="Lovelace", sex="female")',
        sampleReturnValue: 'Ada Lovelace',
        description: 'Shows person.fullName using name and sex options.',
      },
      {
        functionCall: 'person.fullName(firstName="Ada")',
        sampleReturnValue: 'Ada Abbott',
        description: 'Shows person.fullName using an explicit first name.',
      },
      {
        functionCall: 'person.fullName(lastName="Lovelace")',
        sampleReturnValue: 'Aaliyah Lovelace',
        description: 'Shows person.fullName using an explicit last name.',
      },
      {
        functionCall: 'person.fullName(sex="female")',
        sampleReturnValue: 'Monique Gutmann',
        description: 'Shows person.fullName using a sex category.',
      },
    ],
    args: [
      {
        name: 'firstName',
        type: 'string',
        required: false,
        description: 'Optional first name to use as the basis for the full name.',
        examples: ['Ada'],
      },
      {
        name: 'lastName',
        type: 'string',
        required: false,
        description: 'Optional last name to use as the basis for the full name.',
        examples: ['Lovelace'],
      },
      {
        name: 'sex',
        type: 'female|generic|male',
        required: false,
        description: 'Sex category used for the generated full name.',
        examples: ['female'],
      },
    ],
  },
};

export { PERSON_FULL_NAME_KEYWORD_DEFINITION };
