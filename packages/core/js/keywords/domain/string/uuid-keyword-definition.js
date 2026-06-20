import { validateUuidValue } from '../../../command-help/command-help-validators.js';

const STRING_UUID_KEYWORD_DEFINITION = {
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
};

export { STRING_UUID_KEYWORD_DEFINITION };
