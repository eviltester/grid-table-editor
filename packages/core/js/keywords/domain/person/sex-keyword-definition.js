import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_SEX_KEYWORD_DEFINITION = {
  keyword: 'person.sex',
  delegate: {
    type: 'faker',
    target: 'person.sex',
  },
  help: {
    summary: 'Returns a random sex.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.sex',
        sampleReturnValue: 'female',
        description: 'Shows the default person.sex call.',
      },
    ],
    args: [],
  },
};

export { PERSON_SEX_KEYWORD_DEFINITION };
