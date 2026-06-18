import { createStringEnumValidator, validateStringValue } from '../command-help/command-help-validators.js';

const PERSON_SEX_TYPE = 'female|male';
const validatePersonSexTypeValue = createStringEnumValidator(PERSON_SEX_TYPE.split('|'));

const DOMAIN_FAKER_PERSON_KEYWORD_DEFINITIONS = [
  {
    keyword: 'person.bio',
    delegate: {
      type: 'faker',
      target: 'person.bio',
    },
    help: {
      summary: 'Returns a random short biography',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.bio',
          sampleReturnValue: 'person, activist, entrepreneur ✌🏿',
          description: 'Shows the default person.bio call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.firstName',
    delegate: {
      type: 'faker',
      target: 'person.firstName',
    },
    help: {
      summary: 'Returns a random first name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.firstName()',
          sampleReturnValue: 'Aaliyah',
          description: 'Shows person.firstName when optional params are omitted.',
        },
        {
          functionCall: 'person.firstName(sex="female")',
          sampleReturnValue: 'Monique',
          description: 'Shows person.firstName using sex.',
        },
      ],
      args: [
        {
          name: 'sex',
          type: PERSON_SEX_TYPE,
          required: false,
          description: 'Optional sex for first-name selection. Valid values: female or male.',
        },
      ],
    },
  },
  {
    keyword: 'person.fullName',
    delegate: {
      type: 'faker',
      target: 'person.fullName',
    },
    help: {
      summary: 'Generates a random full name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.fullName',
          sampleReturnValue: 'Aaliyah Corkery',
          description: 'Shows the default person.fullName call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.gender',
    delegate: {
      type: 'faker',
      target: 'person.gender',
    },
    help: {
      summary: 'Returns a random gender.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.gender',
          sampleReturnValue: 'Genderflux',
          description: 'Shows the default person.gender call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.jobArea',
    delegate: {
      type: 'faker',
      target: 'person.jobArea',
    },
    help: {
      summary: 'Generates a random job area.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.jobArea',
          sampleReturnValue: 'Group',
          description: 'Shows the default person.jobArea call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.jobDescriptor',
    delegate: {
      type: 'faker',
      target: 'person.jobDescriptor',
    },
    help: {
      summary: 'Generates a random job descriptor.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.jobDescriptor',
          sampleReturnValue: 'Regional',
          description: 'Shows the default person.jobDescriptor call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.jobTitle',
    delegate: {
      type: 'faker',
      target: 'person.jobTitle',
    },
    help: {
      summary: 'Generates a random job title.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.jobTitle',
          sampleReturnValue: 'Regional Assurance Supervisor',
          description: 'Shows the default person.jobTitle call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.jobType',
    delegate: {
      type: 'faker',
      target: 'person.jobType',
    },
    help: {
      summary: 'Generates a random job type.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.jobType',
          sampleReturnValue: 'Administrator',
          description: 'Shows the default person.jobType call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.lastName',
    delegate: {
      type: 'faker',
      target: 'person.lastName',
    },
    help: {
      summary: 'Returns a random last name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.lastName()',
          sampleReturnValue: 'Abbott',
          description: 'Shows person.lastName when optional params are omitted.',
        },
        {
          functionCall: 'person.lastName(sex="female")',
          sampleReturnValue: 'Reichel',
          description: 'Shows person.lastName using sex.',
        },
      ],
      args: [
        {
          name: 'sex',
          type: PERSON_SEX_TYPE,
          required: false,
          description: 'Optional sex for last-name selection. Valid values: female or male.',
        },
      ],
    },
  },
  {
    keyword: 'person.middleName',
    delegate: {
      type: 'faker',
      target: 'person.middleName',
    },
    help: {
      summary: 'Returns a random middle name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.middleName()',
          sampleReturnValue: 'Abigail',
          description: 'Shows person.middleName when optional params are omitted.',
        },
        {
          functionCall: 'person.middleName(sex="female")',
          sampleReturnValue: 'Morgan',
          description: 'Shows person.middleName using sex.',
        },
      ],
      args: [
        {
          name: 'sex',
          type: PERSON_SEX_TYPE,
          required: false,
          description: 'Optional sex for middle-name selection. Valid values: female or male.',
        },
      ],
    },
  },
  {
    keyword: 'person.prefix',
    delegate: {
      type: 'faker',
      target: 'person.prefix',
    },
    help: {
      summary: 'Returns a random person prefix.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.prefix()',
          sampleReturnValue: 'Miss',
          description: 'Shows person.prefix when optional params are omitted.',
        },
        {
          functionCall: 'person.prefix(sex="female")',
          sampleReturnValue: 'Ms.',
          description: 'Shows person.prefix using sex.',
        },
      ],
      args: [
        {
          name: 'sex',
          type: PERSON_SEX_TYPE,
          required: false,
          description: "The optional sex to use. Can be either 'female' or 'male'.",
        },
      ],
    },
  },
  {
    keyword: 'person.sex',
    delegate: {
      type: 'faker',
      target: 'person.sex',
    },
    help: {
      summary: 'Returns a random sex.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.sex',
          sampleReturnValue: 'female',
          description: 'Shows the default person.sex call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.sexType',
    delegate: {
      type: 'faker',
      target: 'person.sexType',
    },
    help: {
      summary: 'Returns a random sex type. The `SexType` is intended to be used in parameters and conditions.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validatePersonSexTypeValue,
      returnType: PERSON_SEX_TYPE,
      usageExamples: [
        {
          functionCall: 'person.sexType',
          sampleReturnValue: 'female',
          description: 'Shows the default person.sexType call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.suffix',
    delegate: {
      type: 'faker',
      target: 'person.suffix',
    },
    help: {
      summary: 'Returns a random person suffix.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.suffix',
          sampleReturnValue: 'III',
          description: 'Shows the default person.suffix call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'person.zodiacSign',
    delegate: {
      type: 'faker',
      target: 'person.zodiacSign',
    },
    help: {
      summary: 'Returns a random zodiac sign.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
      fakerDocsUrl: 'https://fakerjs.dev/api/person',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'person.zodiacSign',
          sampleReturnValue: 'Cancer',
          description: 'Shows the default person.zodiacSign call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_PERSON_KEYWORD_DEFINITIONS };
