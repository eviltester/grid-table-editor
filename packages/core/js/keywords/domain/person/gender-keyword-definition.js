import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_GENDER_KEYWORD_DEFINITION = {
  keyword: 'person.gender',
  delegate: {
    type: 'faker',
    target: 'person.gender',
  },
  help: {
    summary: 'Returns a random gender.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.gender',
        sampleReturnValue: 'Genderflux',
        description: 'Shows the default person.gender call.',
      },
    ],
    args: [],
  },
};

export { PERSON_GENDER_KEYWORD_DEFINITION };
