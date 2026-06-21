import { validateDateValue } from '../../../command-help/command-help-validators.js';

const DATE_BIRTHDATE_KEYWORD_DEFINITION = {
  keyword: 'date.birthdate',
  delegate: {
    type: 'faker',
    target: 'date.birthdate',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary:
      'Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateDateValue,
    returnType: 'date',
    usageExamples: [
      {
        functionCall: 'date.birthdate(refDate=20000, max=69, min=16, mode="age")',
        sampleReturnValue: '1922-07-10T12:11:49.191Z',
        description: 'Shows date.birthdate in use.',
      },
      {
        functionCall: 'date.birthdate()',
        sampleReturnValue: '1971-09-27T08:09:14.757Z',
        description: 'Shows date.birthdate when optional params are omitted.',
      },
      {
        functionCall: 'date.birthdate(refDate=1577836800000)',
        sampleReturnValue: '1965-04-10T16:13:54.757Z',
        description: 'Shows date.birthdate using refDate.',
      },
      {
        functionCall: 'date.birthdate(max=65)',
        sampleReturnValue: '1980-06-25T11:25:42.848Z',
        description: 'Shows date.birthdate using max.',
      },
      {
        functionCall: 'date.birthdate(max=10, min=1)',
        sampleReturnValue: '2019-08-20T15:04:00.805Z',
        description: 'Shows date.birthdate using min.',
      },
      {
        functionCall: 'date.birthdate(mode="age")',
        sampleReturnValue: '1971-09-27T08:09:14.757Z',
        description: 'Shows date.birthdate using mode.',
      },
    ],
    args: [
      {
        name: 'refDate',
        type: 'integer',
        required: false,
        description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        examples: [1577836800000],
      },
      {
        name: 'max',
        type: 'integer',
        required: false,
        description: 'The maximum age/year to generate a birthdate for/in.',
        examples: [65],
      },
      {
        name: 'min',
        type: 'integer',
        required: false,
        description: 'The minimum age/year to generate a birthdate for/in.',
        examples: [18],
      },
      {
        name: 'mode',
        type: 'age|year',
        required: false,
        description: "Either 'age' or 'year' to generate a birthdate based on the age or year range.",
        examples: ['age'],
      },
    ],
  },
};

export { DATE_BIRTHDATE_KEYWORD_DEFINITION };
