import { validateStringValue } from '../../../command-help/command-help-validators.js';

const INTERNET_DOMAIN_SUFFIX_KEYWORD_DEFINITION = {
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
};

export { INTERNET_DOMAIN_SUFFIX_KEYWORD_DEFINITION };
