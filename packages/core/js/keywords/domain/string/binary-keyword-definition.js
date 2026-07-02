import { validateBinaryStringValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const validateStringBinaryArgs = createPositiveIntegerArgsValidator(['length']);

const STRING_BINARY_KEYWORD_DEFINITION = {
  keyword: 'string.binary',
  delegate: {
    type: 'faker',
    target: 'string.binary',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a binary string.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateBinaryStringValue,
    argsValidator: validateStringBinaryArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.binary()',
        sampleReturnValue: '0b0',
        description: 'Shows string.binary when optional params are omitted.',
      },
      {
        functionCall: 'string.binary(length=5)',
        sampleReturnValue: '0b01000',
        description: 'Shows string.binary using length.',
      },
      {
        functionCall: 'string.binary(prefix="PRE-")',
        sampleReturnValue: 'PRE-0',
        description: 'Shows string.binary using prefix.',
      },
    ],
    args: [
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

export { STRING_BINARY_KEYWORD_DEFINITION };
