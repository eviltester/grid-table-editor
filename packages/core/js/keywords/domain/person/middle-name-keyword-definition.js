import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_SEX_TYPE = 'female|male';

const PERSON_MIDDLE_NAME_KEYWORD_DEFINITION = {
  keyword: 'person.middleName',
  delegate: {
    type: 'faker',
    target: 'person.middleName',
  },
  help: {
    summary: 'Returns a random middle name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.middleName()',
        sampleReturnValue: 'Abigail',
        description: 'Shows person.middleName when optional params are omitted.',
      },
      {
        functionCall: 'person.middleName(sex="female")',
        sampleReturnValue: 'Morgan',
        description: 'Shows person.middleName using sex.',
      },
    ],
    args: [
      {
        name: 'sex',
        type: PERSON_SEX_TYPE,
        required: false,
        description: 'Optional sex for middle-name selection. Valid values: female or male.',
      },
    ],
  },
};

export { PERSON_MIDDLE_NAME_KEYWORD_DEFINITION };
