const DOMAIN_FAKER_SYSTEM_KEYWORD_DEFINITIONS = [
  {
    keyword: 'system.commonFileExt',
    delegate: {
      type: 'faker',
      target: 'system.commonFileExt',
    },
    help: {
      summary: 'Returns a commonly used file extension.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'pdf',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'bleak.pdf',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'video',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: '* 15 * * SAT',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: '/bin',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'xsl',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'unsightly.woff',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: '/tmp/ouch.xlt',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'font',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'application/gzip',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'wlx3fba717f9f9c',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/system',
      example: '4.3.6',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_SYSTEM_KEYWORD_DEFINITIONS };
