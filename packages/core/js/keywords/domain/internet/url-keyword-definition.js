import { validateUrlValue } from '../../../command-help/command-help-validators.js';

const HTTP_PROTOCOL_RETURN_TYPE = 'http|https';

const INTERNET_URL_KEYWORD_DEFINITION = {
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
};

export { INTERNET_URL_KEYWORD_DEFINITION };
