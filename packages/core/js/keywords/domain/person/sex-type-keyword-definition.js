import { createStringEnumValidator } from '../../../command-help/command-help-validators.js';

const PERSON_SEX_TYPE = 'female|generic|male';

const validatePersonSexTypeValue = createStringEnumValidator(PERSON_SEX_TYPE.split('|'));

const PERSON_SEX_TYPE_KEYWORD_DEFINITION = {
  keyword: 'person.sexType',
  delegate: {
    type: 'faker',
    target: 'person.sexType',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random sex type. The `SexType` is intended to be used in parameters and conditions.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validatePersonSexTypeValue,
    returnType: PERSON_SEX_TYPE,
    usageExamples: [
      {
        functionCall: 'person.sexType()',
        sampleReturnValue: 'female',
        description: 'Shows the default person.sexType call.',
      },
      {
        functionCall: 'person.sexType(includeGeneric=false)',
        sampleReturnValue: 'female',
        description: 'Shows person.sexType excluding the generic value.',
      },
    ],
    args: [
      {
        name: 'includeGeneric',
        type: 'boolean',
        required: false,
        description: 'Whether the generic sex type can be returned.',
        examples: [false],
      },
    ],
  },
};

export { PERSON_SEX_TYPE_KEYWORD_DEFINITION };
