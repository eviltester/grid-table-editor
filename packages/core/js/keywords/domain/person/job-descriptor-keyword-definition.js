import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_JOB_DESCRIPTOR_KEYWORD_DEFINITION = {
  keyword: 'person.jobDescriptor',
  delegate: {
    type: 'faker',
    target: 'person.jobDescriptor',
  },
  help: {
    summary: 'Generates a random job descriptor.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.jobDescriptor',
        sampleReturnValue: 'Regional',
        description: 'Shows the default person.jobDescriptor call.',
      },
    ],
    args: [],
  },
};

export { PERSON_JOB_DESCRIPTOR_KEYWORD_DEFINITION };
