const DOMAIN_FAKER_HACKER_KEYWORD_DEFINITIONS = [
  {
    keyword: 'hacker.abbreviation',
    delegate: {
      type: 'faker',
      target: 'hacker.abbreviation',
    },
    help: {
      summary: 'Returns a random hacker/IT abbreviation.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'GB',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.adjective',
    delegate: {
      type: 'faker',
      target: 'hacker.adjective',
    },
    help: {
      summary: 'Returns a random hacker/IT adjective.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'bluetooth',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.ingverb',
    delegate: {
      type: 'faker',
      target: 'hacker.ingverb',
    },
    help: {
      summary: 'Returns a random hacker/IT verb for continuous actions (en: ing suffix; e.g. hacking).',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'synthesizing',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.noun',
    delegate: {
      type: 'faker',
      target: 'hacker.noun',
    },
    help: {
      summary: 'Returns a random hacker/IT noun.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'program',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.phrase',
    delegate: {
      type: 'faker',
      target: 'hacker.phrase',
    },
    help: {
      summary: 'Generates a random hacker/IT phrase.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: "compressing the application won't do anything, we need to reboot the neural JSON hard drive!",
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.verb',
    delegate: {
      type: 'faker',
      target: 'hacker.verb',
    },
    help: {
      summary: 'Returns a random hacker/IT verb.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'program',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_HACKER_KEYWORD_DEFINITIONS };
