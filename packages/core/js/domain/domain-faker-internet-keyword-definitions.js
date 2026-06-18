import {
  createStringEnumValidator,
  validateEmailValue,
  validateExampleEmailValue,
  validateIpValue,
  validateIpv4Value,
  validateIpv6Value,
  validateJwtValue,
  validateMacAddressValue,
  validateNumberValue,
  validateStringValue,
  validateUrlValue,
} from '../command-help/command-help-validators.js';

const HTTP_METHOD_RETURN_TYPE = 'GET|POST|PUT|DELETE|PATCH';
const HTTP_PROTOCOL_RETURN_TYPE = 'http|https';
const IPV4_NETWORK_TYPE =
  'any|loopback|private-a|private-b|private-c|test-net-1|test-net-2|test-net-3|link-local|multicast';
const MAC_SEPARATOR_TYPE = '":"|"-"|""';
const JWT_ALGORITHM_RETURN_TYPE = 'ES256|ES384|ES512|HS256|HS384|HS512|PS256|PS384|PS512|RS256|RS384|RS512|none';
const validateHttpMethodValue = createStringEnumValidator(HTTP_METHOD_RETURN_TYPE.split('|'));
const validateProtocolValue = createStringEnumValidator(HTTP_PROTOCOL_RETURN_TYPE.split('|'));
const validateJwtAlgorithmValue = createStringEnumValidator(JWT_ALGORITHM_RETURN_TYPE.split('|'));

const DOMAIN_FAKER_INTERNET_KEYWORD_DEFINITIONS = [
  {
    keyword: 'internet.displayName',
    delegate: {
      type: 'faker',
      target: 'internet.displayName',
    },
    help: {
      summary: "Generates a display name using the given person's name as base.",
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.displayName',
          sampleReturnValue: 'Aaliyah.Bosco',
          description: 'Shows the default internet.displayName call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.domainName',
          sampleReturnValue: 'inferior-punctuation.biz',
          description: 'Shows the default internet.domainName call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.domainSuffix',
          sampleReturnValue: 'info',
          description: 'Shows the default internet.domainSuffix call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.domainWord',
          sampleReturnValue: 'inferior-punctuation',
          description: 'Shows the default internet.domainWord call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.emoji()',
          sampleReturnValue: '🥣',
          description: 'Shows internet.emoji when optional params are omitted.',
        },
        {
          functionCall: 'internet.emoji(types=["food"])',
          sampleReturnValue: '🍲',
          description: 'Shows internet.emoji using types.',
        },
      ],
      args: [
        {
          name: 'types',
          type: 'array',
          required: false,
          description: 'A list of the emoji types that should be used.',
          examples: [['food']],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateExampleEmailValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.exampleEmail',
          sampleReturnValue: 'Edwin.Dibbert@example.net',
          description: 'Shows the default internet.exampleEmail call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateHttpMethodValue,
      returnType: HTTP_METHOD_RETURN_TYPE,
      usageExamples: [
        {
          functionCall: 'internet.httpMethod',
          sampleReturnValue: 'PUT',
          description: 'Shows the default internet.httpMethod call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateNumberValue,
      returnType: 'number',
      usageExamples: [
        {
          functionCall: 'internet.httpStatusCode',
          sampleReturnValue: 306,
          description: 'Shows the default internet.httpStatusCode call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateIpValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.ip',
          sampleReturnValue: '184.103.47.157',
          description: 'Shows the default internet.ip call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateIpv4Value,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.ipv4()',
          sampleReturnValue: '106.193.244.63',
          description: 'Shows internet.ipv4 when optional params are omitted.',
        },
        {
          functionCall: 'internet.ipv4(cidrBlock="192.168.0.0/24")',
          sampleReturnValue: '192.168.0.106',
          description: 'Shows internet.ipv4 using cidrBlock.',
        },
        {
          functionCall: 'internet.ipv4(network="private-a")',
          sampleReturnValue: '10.106.193.244',
          description: 'Shows internet.ipv4 using network.',
        },
      ],
      args: [
        {
          name: 'cidrBlock',
          type: 'string',
          required: false,
          description: 'The optional CIDR block to use. Must be in the format x.x.x.x/y.',
          examples: ['192.168.0.0/24'],
        },
        {
          name: 'network',
          type: IPV4_NETWORK_TYPE,
          required: false,
          description: 'The optional network to use. This is intended as an alias for well-known cidrBlocks.',
          examples: ['private-a'],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateIpv6Value,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.ipv6',
          sampleReturnValue: '9f06:3247:8b9f:4d0e:9c34:bf6f:dd10:3d29',
          description: 'Shows the default internet.ipv6 call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateJwtValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.jwt()',
          sampleReturnValue:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODE3NDc3NTAsImV4cCI6MTc4MTc0Nzc2MSwibmJmIjoxNzY5MzMwODQwLCJpc3MiOiJIZWdtYW5uIC0gSm9obnN0b24iLCJzdWIiOiJhM2UwYTY4Mi0zY2Y1LTRiZWUtYTEwMi1lMTZmOGI1YWQwY2YiLCJhdWQiOiI0YzE3ZTQ0Mi0wYTM0LTQ3MDktODI5Yi0xNmI2MDhhOGY5ZTIiLCJqdGkiOiJjNjJlNWNiZS05YzU0LTRlNmYtOWE5MS1mNzk2M2U5MDk1OGUifQ.UC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914u',
          description: 'Shows internet.jwt when optional params are omitted.',
        },
        {
          functionCall: 'internet.jwt(header={"value":"sample"})',
          sampleReturnValue:
            'eyJ2YWx1ZSI6InNhbXBsZSJ9.eyJpYXQiOjE3ODE3NDc3NTAsImV4cCI6MTc4MTgwOTk4NywibmJmIjoxNzUwMjY5MzM0LCJpc3MiOiJEaWJiZXJ0IC0gTGluZCIsInN1YiI6IjZhM2UwYTY4LTIzY2YtNDViZS1iZTEwLTJlMTZmOGI1YWQwYyIsImF1ZCI6ImI0YzE3ZTQ0LTIwYTMtNDQ3MC04OTI5LWIxNmI2MDhhOGY5ZSIsImp0aSI6IjJjNjJlNWNiLWU5YzUtNDRlNi1iZmE5LTFmNzk2M2U5MDk1OCJ9.mUC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914',
          description: 'Shows internet.jwt using header.',
        },
        {
          functionCall: 'internet.jwt(payload={"value":"sample"})',
          sampleReturnValue:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWx1ZSI6InNhbXBsZSJ9.0i95bloxpGcS1Fpy8cNYjGST52aS6qXxGjGP1KZKhM6rUih81Gdgu3z9AH6pHp3x',
          description: 'Shows internet.jwt using payload.',
        },
        {
          functionCall: 'internet.jwt(refDate=1718755200000)',
          sampleReturnValue:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTg3MDQ4MzAsImV4cCI6MTcxODcwNDg0MSwibmJmIjoxNzA2Mjg3OTIwLCJpc3MiOiJIZWdtYW5uIC0gSm9obnN0b24iLCJzdWIiOiJhM2UwYTY4Mi0zY2Y1LTRiZWUtYTEwMi1lMTZmOGI1YWQwY2YiLCJhdWQiOiI0YzE3ZTQ0Mi0wYTM0LTQ3MDktODI5Yi0xNmI2MDhhOGY5ZTIiLCJqdGkiOiJjNjJlNWNiZS05YzU0LTRlNmYtOWE5MS1mNzk2M2U5MDk1OGUifQ.UC0VGZa8VH4KKVI7111fRxyQ7hAYy1NeOoRKy83726dIy04XzcfKcAYQeuCP914u',
          description: 'Shows internet.jwt using refDate.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateJwtAlgorithmValue,
      returnType: JWT_ALGORITHM_RETURN_TYPE,
      usageExamples: [
        {
          functionCall: 'internet.jwtAlgorithm',
          sampleReturnValue: 'HS512',
          description: 'Shows the default internet.jwtAlgorithm call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateMacAddressValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.mac()',
          sampleReturnValue: '6b:04:21:25:68:6a',
          description: 'Shows internet.mac when optional params are omitted.',
        },
        {
          functionCall: 'internet.mac(separator="-")',
          sampleReturnValue: '6b-04-21-25-68-6a',
          description: 'Shows internet.mac using separator.',
        },
      ],
      args: [
        {
          name: 'separator',
          type: MAC_SEPARATOR_TYPE,
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
  },
  {
    keyword: 'internet.port',
    delegate: {
      type: 'faker',
      target: 'internet.port',
    },
    help: {
      summary: 'Generates a random port number.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateNumberValue,
      returnType: 'number',
      usageExamples: [
        {
          functionCall: 'internet.port',
          sampleReturnValue: 27329,
          description: 'Shows the default internet.port call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateProtocolValue,
      returnType: HTTP_PROTOCOL_RETURN_TYPE,
      usageExamples: [
        {
          functionCall: 'internet.protocol',
          sampleReturnValue: 'http',
          description: 'Shows the default internet.protocol call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateUrlValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.url()',
          sampleReturnValue: 'https://self-reliant-cd.com/',
          description: 'Shows internet.url when optional params are omitted.',
        },
        {
          functionCall: 'internet.url(appendSlash=true)',
          sampleReturnValue: 'https://inferior-punctuation.biz/',
          description: 'Shows internet.url using appendSlash.',
        },
        {
          functionCall: 'internet.url(protocol="https")',
          sampleReturnValue: 'https://self-reliant-cd.com/',
          description: 'Shows internet.url using protocol.',
        },
      ],
      args: [
        {
          name: 'appendSlash',
          type: 'boolean',
          required: false,
          description: 'Whether to append a slash to the end of the url (path).',
        },
        {
          name: 'protocol',
          type: HTTP_PROTOCOL_RETURN_TYPE,
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.userAgent',
          sampleReturnValue:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/586.0.30 (KHTML, like Gecko) Version/16.1 Safari/546.9.18',
          description: 'Shows the default internet.userAgent call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: 'https://fakerjs.dev/api/internet',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'internet.username()',
          sampleReturnValue: 'Aaliyah.Bosco',
          description: 'Shows internet.username when optional params are omitted.',
        },
        {
          functionCall: 'internet.username(firstName="Ada")',
          sampleReturnValue: 'Ada.Abbott14',
          description: 'Shows internet.username using firstName.',
        },
        {
          functionCall: 'internet.username(lastName="Lovelace")',
          sampleReturnValue: 'Aaliyah.Lovelace14',
          description: 'Shows internet.username using lastName.',
        },
      ],
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
];

export { DOMAIN_FAKER_INTERNET_KEYWORD_DEFINITIONS };
