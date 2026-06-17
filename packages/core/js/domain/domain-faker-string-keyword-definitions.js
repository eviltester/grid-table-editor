const DOMAIN_FAKER_STRING_KEYWORD_DEFINITIONS = [
  {
    keyword: 'string.alpha',
    delegate: {
      type: 'faker',
      target: 'string.alpha',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generating a string consisting of letters in the English alphabet.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: 'R',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Desired length of the generated value.',
        },
        {
          name: 'casing',
          type: 'string',
          required: false,
          description: 'The casing of the characters.',
        },
        {
          name: 'exclude',
          type: 'array',
          required: false,
          description: 'An array with characters which should be excluded in the generated string.',
        },
      ],
    },
  },
  {
    keyword: 'string.alphanumeric',
    delegate: {
      type: 'faker',
      target: 'string.alphanumeric',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generating a string consisting of alpha characters and digits.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: 's',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Desired length of the generated value.',
        },
        {
          name: 'casing',
          type: 'string',
          required: false,
          description: 'The casing of the characters.',
        },
        {
          name: 'exclude',
          type: 'array',
          required: false,
          description: 'An array of characters and digits which should be excluded in the generated string.',
        },
      ],
    },
  },
  {
    keyword: 'string.binary',
    delegate: {
      type: 'faker',
      target: 'string.binary',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a binary string.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '0b0',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description:
            'The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'Prefix for the generated number.',
        },
      ],
    },
  },
  {
    keyword: 'string.fromCharacters',
    delegate: {
      type: 'faker',
      target: 'string.fromCharacters',
    },
    help: {
      summary: 'Generates a string from the given characters.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: 'A1B2',
      examples: ['string.fromCharacters("ABC123", 6)', 'string.fromCharacters(characters=["A", "B", "C"], length=4)'],
      exampleReturnValues: ['A1B2', 'CB2A'],
      returnType: 'string',
      args: [
        {
          name: 'characters',
          type: 'string|array',
          required: true,
          description: 'Character set (string or array) used when generating output.',
          examples: ['ABC123'],
        },
        {
          name: 'length',
          type: 'integer',
          required: false,
          description: 'Desired length of the generated value.',
          examples: [4],
        },
      ],
    },
  },
  {
    keyword: 'string.hexadecimal',
    delegate: {
      type: 'faker',
      target: 'string.hexadecimal',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a hexadecimal string.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '0x1',
      returnType: 'string',
      args: [
        {
          name: 'casing',
          type: 'string',
          required: false,
          description: 'Casing of the generated number.',
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          description:
            'The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'Prefix for the generated number.',
        },
      ],
    },
  },
  {
    keyword: 'string.nanoid',
    delegate: {
      type: 'faker',
      target: 'string.nanoid',
    },
    help: {
      summary: 'Generates a Nano ID.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: 'KLm49ferlh-eUmJpZdSIO',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Exact number of characters to generate.',
        },
      ],
    },
  },
  {
    keyword: 'string.numeric',
    delegate: {
      type: 'faker',
      target: 'string.numeric',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a given length string of digits.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '7',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Desired length of the generated value.',
        },
        {
          name: 'allowLeadingZeros',
          type: 'boolean',
          required: false,
          description: 'Whether leading zeros are allowed or not.',
        },
        {
          name: 'exclude',
          type: 'array',
          required: false,
          description: 'An array of digits which should be excluded in the generated string.',
        },
      ],
    },
  },
  {
    keyword: 'string.octal',
    delegate: {
      type: 'faker',
      target: 'string.octal',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns an octal string.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '0o6',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description:
            'The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'Prefix for the generated number.',
        },
      ],
    },
  },
  {
    keyword: 'string.sample',
    delegate: {
      type: 'faker',
      target: 'string.sample',
    },
    help: {
      summary: 'Returns a string containing UTF-16 chars between 33 and 125 (`!` to `}`).',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '\\Fw;0e:G.H',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Exact number of characters to generate.',
        },
      ],
    },
  },
  {
    keyword: 'string.symbol',
    delegate: {
      type: 'faker',
      target: 'string.symbol',
    },
    help: {
      summary: 'Returns a string containing only special characters from the following list:',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '.',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Exact number of characters to generate.',
        },
      ],
    },
  },
  {
    keyword: 'string.ulid',
    delegate: {
      type: 'faker',
      target: 'string.ulid',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a ULID (Universally Unique Lexicographically Sortable Identifier).',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '01KQADM2A0728G4D2HKCPWKS6N',
      returnType: 'string',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description:
            'The date to use as reference point for the newly generated ULID encoded timestamp. The encoded timestamp is represented by the first 10 characters of the result.',
        },
      ],
    },
  },
  {
    keyword: 'string.uuid',
    delegate: {
      type: 'faker',
      target: 'string.uuid',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a UUID (Universally Unique Identifier).',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '0628ae51-7b6c-4d33-9f24-dae19fb245df',
      returnType: 'string',
      args: [
        {
          name: 'version',
          type: '4|7',
          required: false,
          description:
            'The specific UUID version to use. If refDate is supplied and version is omitted, version 7 is used automatically.',
        },
        {
          name: 'refDate',
          type: 'string|number|date',
          required: false,
          description:
            'The timestamp to encode into the UUID. This is only valid for UUID v7. If refDate is supplied and version is omitted, version 7 is used automatically. Providing refDate with version 4 is invalid.',
        },
      ],
    },
  },
];

export { DOMAIN_FAKER_STRING_KEYWORD_DEFINITIONS };
