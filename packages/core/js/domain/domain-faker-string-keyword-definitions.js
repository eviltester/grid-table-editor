import {
  validateAlphaStringValue,
  validateAlphanumericStringValue,
  validateBinaryStringValue,
  validateFromCharactersStringValue,
  validateHexadecimalStringValue,
  validateNanoIdValue,
  validateNumericStringValue,
  validateOctalStringValue,
  validateSampleStringValue,
  validateSymbolStringValue,
  validateUlidValue,
  validateUuidValue,
} from '../command-help/command-help-validators.js';

const STRING_CASING_TYPE = 'upper|lower|mixed';

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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateAlphaStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.alpha()',
          sampleReturnValue: 'v',
          description: 'Shows string.alpha with all optional params omitted.',
        },
        {
          functionCall: 'string.alpha(length=5)',
          sampleReturnValue: 'vLaph',
          description: 'Shows string.alpha generating a fixed-length alphabetic value.',
        },
        {
          functionCall: 'string.alpha(casing="upper")',
          sampleReturnValue: 'K',
          description: 'Shows string.alpha using only the casing option.',
        },
        {
          functionCall: 'string.alpha(length=5, casing="upper")',
          sampleReturnValue: 'KSAHD',
          description: 'Shows string.alpha with explicit uppercase output.',
        },
        {
          functionCall: 'string.alpha(exclude=["A","B","C"])',
          sampleReturnValue: 'u',
          description: 'Shows string.alpha excluding specific characters without setting length or casing.',
        },
        {
          functionCall: 'string.alpha(length=5, casing="upper", exclude=["A","B","C"])',
          sampleReturnValue: 'MTDJG',
          description: 'Shows string.alpha excluding specific characters from the candidate set.',
        },
      ],
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Desired length of the generated value.',
        },
        {
          name: 'casing',
          type: STRING_CASING_TYPE,
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateAlphanumericStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.alphanumeric()',
          sampleReturnValue: 'p',
          description: 'Shows string.alphanumeric when optional params are omitted.',
        },
        {
          functionCall: 'string.alphanumeric(length=5)',
          sampleReturnValue: 'pI0i9',
          description: 'Shows string.alphanumeric using length.',
        },
        {
          functionCall: 'string.alphanumeric(casing="upper")',
          sampleReturnValue: 'F',
          description: 'Shows string.alphanumeric using casing.',
        },
        {
          functionCall: 'string.alphanumeric(exclude=["A","B","C"])',
          sampleReturnValue: 'o',
          description: 'Shows string.alphanumeric using exclude.',
        },
      ],
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Desired length of the generated value.',
        },
        {
          name: 'casing',
          type: STRING_CASING_TYPE,
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateBinaryStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.binary()',
          sampleReturnValue: '0b0',
          description: 'Shows string.binary when optional params are omitted.',
        },
        {
          functionCall: 'string.binary(length=5)',
          sampleReturnValue: '0b01000',
          description: 'Shows string.binary using length.',
        },
        {
          functionCall: 'string.binary(prefix="PRE-")',
          sampleReturnValue: 'PRE-0',
          description: 'Shows string.binary using prefix.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateFromCharactersStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.fromCharacters("ABC123", 6)',
          sampleReturnValue: 'C2ABAA',
          description: 'Shows string.fromCharacters in use.',
        },
        {
          functionCall: 'string.fromCharacters(characters=["A", "B", "C"], length=4)',
          sampleReturnValue: 'BCAA',
          description: 'Shows string.fromCharacters in use.',
        },
        {
          functionCall: 'string.fromCharacters(characters="ABC123", length=4)',
          sampleReturnValue: 'C2AB',
          description: 'Shows string.fromCharacters using length.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateHexadecimalStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.hexadecimal()',
          sampleReturnValue: '0x9',
          description: 'Shows string.hexadecimal when optional params are omitted.',
        },
        {
          functionCall: 'string.hexadecimal(casing="upper")',
          sampleReturnValue: '0x9',
          description: 'Shows string.hexadecimal using casing.',
        },
        {
          functionCall: 'string.hexadecimal(length=5)',
          sampleReturnValue: '0x9f063',
          description: 'Shows string.hexadecimal using length.',
        },
        {
          functionCall: 'string.hexadecimal(prefix="PRE-")',
          sampleReturnValue: 'PRE-9',
          description: 'Shows string.hexadecimal using prefix.',
        },
      ],
      args: [
        {
          name: 'casing',
          type: STRING_CASING_TYPE,
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateNanoIdValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.nanoid()',
          sampleReturnValue: 'Ii5lxGSFycYGT2SqxjPK-',
          description: 'Shows string.nanoid when optional params are omitted.',
        },
        {
          functionCall: 'string.nanoid(length=5)',
          sampleReturnValue: 'Ii5lx',
          description: 'Shows string.nanoid using length.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateNumericStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.numeric()',
          sampleReturnValue: '4',
          description: 'Shows string.numeric when optional params are omitted.',
        },
        {
          functionCall: 'string.numeric(length=5)',
          sampleReturnValue: '47031',
          description: 'Shows string.numeric using length.',
        },
        {
          functionCall: 'string.numeric(allowLeadingZeros=true)',
          sampleReturnValue: '4',
          description: 'Shows string.numeric using allowLeadingZeros.',
        },
        {
          functionCall: 'string.numeric(exclude=["A","B","C"])',
          sampleReturnValue: '4',
          description: 'Shows string.numeric using exclude.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateOctalStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.octal()',
          sampleReturnValue: '0o3',
          description: 'Shows string.octal when optional params are omitted.',
        },
        {
          functionCall: 'string.octal(length=5)',
          sampleReturnValue: '0o35021',
          description: 'Shows string.octal using length.',
        },
        {
          functionCall: 'string.octal(prefix="PRE-")',
          sampleReturnValue: 'PRE-3',
          description: 'Shows string.octal using prefix.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateSampleStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.sample()',
          sampleReturnValue: 'Gc!=.)2AES',
          description: 'Shows string.sample when optional params are omitted.',
        },
        {
          functionCall: 'string.sample(length=5)',
          sampleReturnValue: 'Gc!=.',
          description: 'Shows string.sample using length.',
        },
      ],
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
      summary:
        'Returns a string containing only ASCII symbol characters such as !, ", #, $, %, &, (, ), *, +, -, /, :, ;, <, =, >, ?, @, [, \\, ], ^, _, `, {, |, }, and ~.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateSymbolStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.symbol()',
          sampleReturnValue: '.',
          description: 'Shows string.symbol when optional params are omitted.',
        },
        {
          functionCall: 'string.symbol(length=5)',
          sampleReturnValue: '.\\!*%',
          description: 'Shows string.symbol using length.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateUlidValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.ulid()',
          sampleReturnValue: '01KVDQ3AJ0DQ09425BCHDN6W0N',
          description: 'Shows string.ulid when optional params are omitted.',
        },
        {
          functionCall: 'string.ulid(refDate=1718755200000)',
          sampleReturnValue: '01J0PWP300DQ09425BCHDN6W0N',
          description: 'Shows string.ulid using refDate.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
      fakerDocsUrl: 'https://fakerjs.dev/api/string',
      validator: validateUuidValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.uuid()',
          sampleReturnValue: '6b042125-686a-43e0-8a68-23cf5bee102e',
          description: 'Shows string.uuid when optional params are omitted.',
        },
        {
          functionCall: 'string.uuid(version=7)',
          sampleReturnValue: '019edb71-aa40-76b0-8421-25686a3e0a68',
          description: 'Shows string.uuid using version.',
        },
        {
          functionCall: 'string.uuid(refDate="2026-06-18T00:00:00.000Z")',
          sampleReturnValue: '019ed807-0800-76b0-8421-25686a3e0a68',
          description: 'Shows string.uuid using refDate.',
        },
      ],
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
