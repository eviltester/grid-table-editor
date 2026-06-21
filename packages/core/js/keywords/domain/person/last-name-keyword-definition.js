import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_SEX_TYPE = 'female|male';

const PERSON_LAST_NAME_KEYWORD_DEFINITION = {
  keyword: 'person.lastName',
  delegate: {
    type: 'faker',
    target: 'person.lastName',
  },
  help: {
    summary: 'Returns a random last name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.lastName()',
        sampleReturnValue: 'Abbott',
        description: 'Shows person.lastName when optional params are omitted.',
      },
      {
        functionCall: 'person.lastName(sex="female")',
        sampleReturnValue: 'Reichel',
        description: 'Shows person.lastName using sex.',
      },
    ],
    args: [
      {
        name: 'sex',
        type: PERSON_SEX_TYPE,
        required: false,
        description: 'Optional sex for last-name selection. Valid values: female or male.',
      },
    ],
  },
};

export { PERSON_LAST_NAME_KEYWORD_DEFINITION };
