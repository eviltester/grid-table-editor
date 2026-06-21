import { validateStringValue } from '../../../command-help/command-help-validators.js';

const INTERNET_DOMAIN_NAME_KEYWORD_DEFINITION = {
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
};

export { INTERNET_DOMAIN_NAME_KEYWORD_DEFINITION };
