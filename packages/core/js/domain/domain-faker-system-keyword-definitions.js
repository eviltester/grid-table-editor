import {
  validateCronValue,
  validateMimeTypeValue,
  validateSemverValue,
  validateStringValue,
} from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_SYSTEM_KEYWORD_DEFINITIONS = [
  {
    keyword: 'system.commonFileExt',
    delegate: {
      type: 'faker',
      target: 'system.commonFileExt',
    },
    help: {
      summary: 'Returns a commonly used file extension.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.commonFileExt',
          sampleReturnValue: 'png',
          description: 'Shows the default system.commonFileExt call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'system.commonFileName',
    delegate: {
      type: 'faker',
      target: 'system.commonFileName',
    },
    help: {
      summary: 'Returns a random file name with a given extension or a commonly used extension.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.commonFileName()',
          sampleReturnValue: 'fog_aboard.mp4v',
          description: 'Shows system.commonFileName when optional params are omitted.',
        },
        {
          functionCall: 'system.commonFileName(extension="txt")',
          sampleReturnValue: 'fog_aboard.txt',
          description: 'Shows system.commonFileName using extension.',
        },
      ],
      args: [
        {
          name: 'extension',
          type: 'string',
          required: false,
          description: 'File extension to include in the generated filename.',
        },
      ],
    },
  },
  {
    keyword: 'system.commonFileType',
    delegate: {
      type: 'faker',
      target: 'system.commonFileType',
    },
    help: {
      summary: 'Returns a commonly used file type.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.commonFileType',
          sampleReturnValue: 'image',
          description: 'Shows the default system.commonFileType call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'system.cron',
    delegate: {
      type: 'faker',
      target: 'system.cron',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random cron expression.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateCronValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.cron()',
          sampleReturnValue: '25 17 * 4 *',
          description: 'Shows system.cron when optional params are omitted.',
        },
        {
          functionCall: 'system.cron(includeNonStandard=true)',
          sampleReturnValue: '@annually',
          description: 'Shows system.cron using includeNonStandard.',
        },
        {
          functionCall: 'system.cron(includeYear=true)',
          sampleReturnValue: '25 17 * 4 * 1994',
          description: 'Shows system.cron using includeYear.',
        },
      ],
      args: [
        {
          name: 'includeNonStandard',
          type: 'boolean',
          required: false,
          description: 'Whether to include a @yearly, @monthly, @daily, etc text labels in the generated expression.',
        },
        {
          name: 'includeYear',
          type: 'boolean',
          required: false,
          description: 'Whether to include a year in the generated expression.',
        },
      ],
    },
  },
  {
    keyword: 'system.directoryPath',
    delegate: {
      type: 'faker',
      target: 'system.directoryPath',
    },
    help: {
      summary: 'Returns a directory path.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.directoryPath',
          sampleReturnValue: '/opt/include',
          description: 'Shows the default system.directoryPath call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'system.fileExt',
    delegate: {
      type: 'faker',
      target: 'system.fileExt',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a file extension.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.fileExt()',
          sampleReturnValue: '7z',
          description: 'Shows system.fileExt when optional params are omitted.',
        },
        {
          functionCall: 'system.fileExt(mimeType="image/png")',
          sampleReturnValue: '7z',
          description: 'Shows system.fileExt using mimeType.',
        },
      ],
      args: [
        {
          name: 'mimeType',
          type: 'string',
          required: false,
          description: 'MIME type used to constrain generated values.',
        },
      ],
    },
  },
  {
    keyword: 'system.fileName',
    delegate: {
      type: 'faker',
      target: 'system.fileName',
    },
    help: {
      summary: 'Returns a random file name with extension.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.fileName',
          sampleReturnValue: 'fog_aboard.otf',
          description: 'Shows the default system.fileName call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'system.filePath',
    delegate: {
      type: 'faker',
      target: 'system.filePath',
    },
    help: {
      summary: 'Returns a file path.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.filePath',
          sampleReturnValue: '/opt/include/down_reproachfully_besides.woff2',
          description: 'Shows the default system.filePath call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'system.fileType',
    delegate: {
      type: 'faker',
      target: 'system.fileType',
    },
    help: {
      summary: 'Returns a file type.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.fileType',
          sampleReturnValue: 'font',
          description: 'Shows the default system.fileType call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'system.mimeType',
    delegate: {
      type: 'faker',
      target: 'system.mimeType',
    },
    help: {
      summary: 'Returns a mime-type.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateMimeTypeValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.mimeType',
          sampleReturnValue: 'application/x-httpd-php',
          description: 'Shows the default system.mimeType call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'system.networkInterface',
    delegate: {
      type: 'faker',
      target: 'system.networkInterface',
    },
    help: {
      summary: 'Returns a random network interface.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.networkInterface',
          sampleReturnValue: 'wlx042125686a3e',
          description: 'Shows the default system.networkInterface call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'system.semver',
    delegate: {
      type: 'faker',
      target: 'system.semver',
    },
    help: {
      summary: 'Returns a semantic version.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
      fakerDocsUrl: 'https://fakerjs.dev/api/system',
      validator: validateSemverValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'system.semver',
          sampleReturnValue: '4.15.0',
          description: 'Shows the default system.semver call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_SYSTEM_KEYWORD_DEFINITIONS };
