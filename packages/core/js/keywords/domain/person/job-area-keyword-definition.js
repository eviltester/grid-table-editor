import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_JOB_AREA_KEYWORD_DEFINITION = {
  keyword: 'person.jobArea',
  delegate: {
    type: 'faker',
    target: 'person.jobArea',
  },
  help: {
    summary: 'Generates a random job area.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.jobArea',
        sampleReturnValue: 'Group',
        description: 'Shows the default person.jobArea call.',
      },
    ],
    args: [],
  },
};

export { PERSON_JOB_AREA_KEYWORD_DEFINITION };
