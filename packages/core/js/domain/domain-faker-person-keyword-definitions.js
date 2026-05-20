const DOMAIN_FAKER_PERSON_KEYWORD_DEFINITIONS = [
  {
    keyword: 'person.bio',
    delegate: {
      type: 'faker',
      target: 'person.bio',
    },
    help: {
      summary: 'Returns a random short biography',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'musician',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'David',
      returnType: 'string',
      args: [
        {
          name: 'sex',
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Mrs. Sheryl Zemlak DVM',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Female to male',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Branding',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Direct',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Senior Identity Technician',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Engineer',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Bernhard',
      returnType: 'string',
      args: [
        {
          name: 'sex',
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Ryan',
      returnType: 'string',
      args: [
        {
          name: 'sex',
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Mr.',
      returnType: 'string',
      args: [
        {
          name: 'sex',
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'male',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'male',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'IV',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Cancer',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_PERSON_KEYWORD_DEFINITIONS };
