const DOMAIN_FAKER_COMPANY_KEYWORD_DEFINITIONS = [
  {
    keyword: 'company.buzzAdjective',
    delegate: {
      type: 'faker',
      target: 'company.buzzAdjective',
    },
    help: {
      summary: 'Returns a random buzz adjective that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'out-of-the-box',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.buzzNoun',
    delegate: {
      type: 'faker',
      target: 'company.buzzNoun',
    },
    help: {
      summary: 'Returns a random buzz noun that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'deliverables',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.buzzPhrase',
    delegate: {
      type: 'faker',
      target: 'company.buzzPhrase',
    },
    help: {
      summary: 'Generates a random buzz phrase that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'streamline cutting-edge platforms',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.buzzVerb',
    delegate: {
      type: 'faker',
      target: 'company.buzzVerb',
    },
    help: {
      summary: 'Returns a random buzz verb that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'disintermediate',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.catchPhrase',
    delegate: {
      type: 'faker',
      target: 'company.catchPhrase',
    },
    help: {
      summary: 'Generates a random catch phrase that can be displayed to an end user.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'Diverse AI-powered flexibility',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.catchPhraseAdjective',
    delegate: {
      type: 'faker',
      target: 'company.catchPhraseAdjective',
    },
    help: {
      summary: 'Returns a random catch phrase adjective that can be displayed to an end user.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'Distributed',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.catchPhraseDescriptor',
    delegate: {
      type: 'faker',
      target: 'company.catchPhraseDescriptor',
    },
    help: {
      summary: 'Returns a random catch phrase descriptor that can be displayed to an end user.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'encompassing',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.catchPhraseNoun',
    delegate: {
      type: 'faker',
      target: 'company.catchPhraseNoun',
    },
    help: {
      summary: 'Returns a random catch phrase noun that can be displayed to an end user.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'attitude',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.name',
    delegate: {
      type: 'faker',
      target: 'company.name',
    },
    help: {
      summary: 'Generates a random company name.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'Lang - Little',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_COMPANY_KEYWORD_DEFINITIONS };
