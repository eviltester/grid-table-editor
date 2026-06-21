import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_BIO_KEYWORD_DEFINITION = {
  keyword: 'person.bio',
  delegate: {
    type: 'faker',
    target: 'person.bio',
  },
  help: {
    summary: 'Returns a random short biography',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.bio',
        sampleReturnValue: 'person, activist, entrepreneur ✌🏿',
        description: 'Shows the default person.bio call.',
      },
    ],
    args: [],
  },
};

export { PERSON_BIO_KEYWORD_DEFINITION };
