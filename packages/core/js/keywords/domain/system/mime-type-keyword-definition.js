import { validateMimeTypeValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_MIME_TYPE_KEYWORD_DEFINITION = {
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
};

export { SYSTEM_MIME_TYPE_KEYWORD_DEFINITION };
