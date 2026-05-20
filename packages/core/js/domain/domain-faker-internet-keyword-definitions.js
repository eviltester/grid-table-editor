const DOMAIN_FAKER_INTERNET_KEYWORD_DEFINITIONS = [
  {
    keyword: 'internet.color',
    delegate: {
      type: 'faker',
      target: 'internet.color',
    },
    help: {
      summary: 'Generates a random css hex color code in aesthetically pleasing color palette.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '#290551',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.displayName',
    delegate: {
      type: 'faker',
      target: 'internet.displayName',
    },
    help: {
      summary: "Generates a display name using the given person's name as base.",
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Cordell0',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.domainName',
    delegate: {
      type: 'faker',
      target: 'internet.domainName',
    },
    help: {
      summary: 'Generates a random domain name.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'beloved-peony.org',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.domainSuffix',
    delegate: {
      type: 'faker',
      target: 'internet.domainSuffix',
    },
    help: {
      summary: 'Returns a random domain suffix.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'com',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.domainWord',
    delegate: {
      type: 'faker',
      target: 'internet.domainWord',
    },
    help: {
      summary: 'Generates a random domain word.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'inexperienced-ravioli',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.email',
    delegate: {
      type: 'faker',
      target: 'internet.email',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates data using faker internet email.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Jana91@hotmail.com',
      returnType: 'string',
      args: [
        {
          name: 'allowSpecialCharacters',
          type: 'boolean',
          required: false,
          description:
            "Whether special characters such as .!#$%&'*+-/=?^_`{|}~ should be included in the email address.",
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
  },
  {
    keyword: 'internet.emoji',
    delegate: {
      type: 'faker',
      target: 'internet.emoji',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random emoji.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '🤨',
      returnType: 'string',
      args: [
        {
          name: 'types',
          type: 'array',
          required: false,
          description: 'A list of the emoji types that should be used.',
        },
      ],
    },
  },
  {
    keyword: 'internet.exampleEmail',
    delegate: {
      type: 'faker',
      target: 'internet.exampleEmail',
    },
    help: {
      summary: 'Generates data using faker internet example email.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Jeremie37@example.net',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.httpMethod',
    delegate: {
      type: 'faker',
      target: 'internet.httpMethod',
    },
    help: {
      summary: 'Returns a random http method.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'PATCH',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.httpStatusCode',
    delegate: {
      type: 'faker',
      target: 'internet.httpStatusCode',
    },
    help: {
      summary: 'Generates a random HTTP status code.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '303',
      returnType: 'number',
      args: [],
    },
  },
  {
    keyword: 'internet.ip',
    delegate: {
      type: 'faker',
      target: 'internet.ip',
    },
    help: {
      summary: 'Generates a random IPv4 or IPv6 address.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '56.23.30.52',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.ipv4',
    delegate: {
      type: 'faker',
      target: 'internet.ipv4',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random IPv4 address.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '192.168.0.42',
      returnType: 'string',
      args: [
        {
          name: 'cidrBlock',
          type: 'string',
          required: false,
          description: 'The optional CIDR block to use. Must be in the format x.x.x.x/y.',
        },
        {
          name: 'network',
          type: 'string',
          required: false,
          description: 'The optional network to use. This is intended as an alias for well-known cidrBlocks.',
        },
      ],
    },
  },
  {
    keyword: 'internet.ipv6',
    delegate: {
      type: 'faker',
      target: 'internet.ipv6',
    },
    help: {
      summary: 'Generates a random IPv6 address.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.jwt',
    delegate: {
      type: 'faker',
      target: 'internet.jwt',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random JWT (JSON Web Token).',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBY21lIn0.c2lnbmF0dXJl',
      returnType: 'string',
      args: [
        {
          name: 'header',
          type: 'object',
          required: false,
          description: 'The header to use for the token. If present, it will replace any default values.',
        },
        {
          name: 'payload',
          type: 'object',
          required: false,
          description: 'The payload to use for the token. If present, it will replace any default values.',
        },
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        },
      ],
    },
  },
  {
    keyword: 'internet.jwtAlgorithm',
    delegate: {
      type: 'faker',
      target: 'internet.jwtAlgorithm',
    },
    help: {
      summary: 'Generates a random JWT (JSON Web Token) Algorithm.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'PS384',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.mac',
    delegate: {
      type: 'faker',
      target: 'internet.mac',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random mac address.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'ae:a9:d7:ba:d2:bd',
      returnType: 'string',
      args: [
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: "The optional separator to use. Can be either ':', '-' or ''.",
        },
      ],
    },
  },
  {
    keyword: 'internet.password',
    delegate: {
      type: 'faker',
      target: 'internet.password',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Generates a random password-like string. Do not use this method for generating actual passwords for users.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'og1ejoksrfwVbIF',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'The length of the password to generate.',
        },
        {
          name: 'memorable',
          type: 'boolean',
          required: false,
          description: 'Whether the generated password should be memorable.',
        },
        {
          name: 'pattern',
          type: 'string',
          required: false,
          description: 'The pattern that all chars should match. This option will be ignored, if memorable is true.',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'The prefix to use.',
        },
      ],
    },
  },
  {
    keyword: 'internet.port',
    delegate: {
      type: 'faker',
      target: 'internet.port',
    },
    help: {
      summary: 'Generates a random port number.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '24545',
      returnType: 'number',
      args: [],
    },
  },
  {
    keyword: 'internet.protocol',
    delegate: {
      type: 'faker',
      target: 'internet.protocol',
    },
    help: {
      summary: 'Returns a random web protocol. Either `http` or `https`.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'http',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.url',
    delegate: {
      type: 'faker',
      target: 'internet.url',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random http(s) url.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'https://brave-interior.biz/',
      returnType: 'string',
      args: [
        {
          name: 'appendSlash',
          type: 'boolean',
          required: false,
          description: 'Whether to append a slash to the end of the url (path).',
        },
        {
          name: 'protocol',
          type: 'string',
          required: false,
          description: 'The protocol to use.',
        },
      ],
    },
  },
  {
    keyword: 'internet.userAgent',
    delegate: {
      type: 'faker',
      target: 'internet.userAgent',
    },
    help: {
      summary: 'Generates a random user agent string.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.username',
    delegate: {
      type: 'faker',
      target: 'internet.username',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: "Generates a username using the given person's name as base.",
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Deanna51',
      returnType: 'string',
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
  },
  {
    keyword: 'internet.userName',
    delegate: {
      type: 'faker',
      target: 'internet.userName',
    },
    help: {
      summary: "Generates a username using the given person's name as base.",
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Ana_Keebler',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_INTERNET_KEYWORD_DEFINITIONS };
