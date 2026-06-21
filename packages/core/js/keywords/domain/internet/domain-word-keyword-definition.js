import { validateStringValue } from '../../../command-help/command-help-validators.js';

const INTERNET_DOMAIN_WORD_KEYWORD_DEFINITION = {
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
};

export { INTERNET_DOMAIN_WORD_KEYWORD_DEFINITION };
