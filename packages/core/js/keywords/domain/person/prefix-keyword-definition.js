import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_SEX_TYPE = 'female|male';

const PERSON_PREFIX_KEYWORD_DEFINITION = {
  keyword: 'person.prefix',
  delegate: {
    type: 'faker',
    target: 'person.prefix',
  },
  help: {
    summary: 'Returns a random person prefix.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.prefix()',
        sampleReturnValue: 'Miss',
        description: 'Shows person.prefix when optional params are omitted.',
      },
      {
        functionCall: 'person.prefix(sex="female")',
        sampleReturnValue: 'Ms.',
        description: 'Shows person.prefix using sex.',
      },
    ],
    args: [
      {
        name: 'sex',
        type: PERSON_SEX_TYPE,
        required: false,
        description: "The optional sex to use. Can be either 'female' or 'male'.",
      },
    ],
  },
};

export { PERSON_PREFIX_KEYWORD_DEFINITION };
