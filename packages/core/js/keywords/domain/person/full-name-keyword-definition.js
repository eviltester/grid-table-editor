import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_FULL_NAME_KEYWORD_DEFINITION = {
  keyword: 'person.fullName',
  delegate: {
    type: 'faker',
    target: 'person.fullName',
  },
  help: {
    summary: 'Generates a random full name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.fullName',
        sampleReturnValue: 'Aaliyah Corkery',
        description: 'Shows the default person.fullName call.',
      },
    ],
    args: [],
  },
};

export { PERSON_FULL_NAME_KEYWORD_DEFINITION };
