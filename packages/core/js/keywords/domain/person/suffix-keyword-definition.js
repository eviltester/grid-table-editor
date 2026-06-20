import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_SUFFIX_KEYWORD_DEFINITION = {
  keyword: 'person.suffix',
  delegate: {
    type: 'faker',
    target: 'person.suffix',
  },
  help: {
    summary: 'Returns a random person suffix.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.suffix',
        sampleReturnValue: 'III',
        description: 'Shows the default person.suffix call.',
      },
    ],
    args: [],
  },
};

export { PERSON_SUFFIX_KEYWORD_DEFINITION };
