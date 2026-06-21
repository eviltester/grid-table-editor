import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_SEX_TYPE = 'female|male';

const PERSON_FIRST_NAME_KEYWORD_DEFINITION = {
  keyword: 'person.firstName',
  delegate: {
    type: 'faker',
    target: 'person.firstName',
  },
  help: {
    summary: 'Returns a random first name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.firstName()',
        sampleReturnValue: 'Aaliyah',
        description: 'Shows person.firstName when optional params are omitted.',
      },
      {
        functionCall: 'person.firstName(sex="female")',
        sampleReturnValue: 'Monique',
        description: 'Shows person.firstName using sex.',
      },
    ],
    args: [
      {
        name: 'sex',
        type: PERSON_SEX_TYPE,
        required: false,
        description: 'Optional sex for first-name selection. Valid values: female or male.',
      },
    ],
  },
};

export { PERSON_FIRST_NAME_KEYWORD_DEFINITION };
