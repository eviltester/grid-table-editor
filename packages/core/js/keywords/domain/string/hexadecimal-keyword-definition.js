import { validateHexadecimalStringValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const STRING_CASING_TYPE = 'upper|lower|mixed';
const validateStringHexadecimalArgs = createPositiveIntegerArgsValidator(['length']);

const STRING_HEXADECIMAL_KEYWORD_DEFINITION = {
  keyword: 'string.hexadecimal',
  delegate: {
    type: 'faker',
    target: 'string.hexadecimal',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a hexadecimal string.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateHexadecimalStringValue,
    argsValidator: validateStringHexadecimalArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.hexadecimal()',
        sampleReturnValue: '0x9',
        description: 'Shows string.hexadecimal when optional params are omitted.',
      },
      {
        functionCall: 'string.hexadecimal(casing="upper")',
        sampleReturnValue: '0x9',
        description: 'Shows string.hexadecimal using casing.',
      },
      {
        functionCall: 'string.hexadecimal(length=5)',
        sampleReturnValue: '0x9f063',
        description: 'Shows string.hexadecimal using length.',
      },
      {
        functionCall: 'string.hexadecimal(prefix="PRE-")',
        sampleReturnValue: 'PRE-9',
        description: 'Shows string.hexadecimal using prefix.',
      },
    ],
    args: [
      {
        name: 'casing',
        type: STRING_CASING_TYPE,
        required: false,
        description: 'Casing of the generated number.',
      },
      {
        name: 'length',
        type: 'number',
        required: false,
        description:
          'The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.',
      },
      {
        name: 'prefix',
        type: 'string',
        required: false,
        description: 'Prefix for the generated number.',
      },
    ],
  },
};

export { STRING_HEXADECIMAL_KEYWORD_DEFINITION };
