import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_JOB_TITLE_KEYWORD_DEFINITION = {
  keyword: 'person.jobTitle',
  delegate: {
    type: 'faker',
    target: 'person.jobTitle',
  },
  help: {
    summary: 'Generates a random job title.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.jobTitle',
        sampleReturnValue: 'Regional Assurance Supervisor',
        description: 'Shows the default person.jobTitle call.',
      },
    ],
    args: [],
  },
};

export { PERSON_JOB_TITLE_KEYWORD_DEFINITION };
