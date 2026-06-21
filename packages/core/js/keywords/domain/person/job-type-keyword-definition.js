import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_JOB_TYPE_KEYWORD_DEFINITION = {
  keyword: 'person.jobType',
  delegate: {
    type: 'faker',
    target: 'person.jobType',
  },
  help: {
    summary: 'Generates a random job type.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.jobType',
        sampleReturnValue: 'Administrator',
        description: 'Shows the default person.jobType call.',
      },
    ],
    args: [],
  },
};

export { PERSON_JOB_TYPE_KEYWORD_DEFINITION };
