import { validateOctalStringValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const validateStringOctalArgs = createPositiveIntegerArgsValidator(['length']);

const STRING_OCTAL_KEYWORD_DEFINITION = {
  keyword: 'string.octal',
  delegate: {
    type: 'faker',
    target: 'string.octal',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns an octal string.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateOctalStringValue,
    argsValidator: validateStringOctalArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.octal()',
        sampleReturnValue: '0o3',
        description: 'Shows string.octal when optional params are omitted.',
      },
      {
        functionCall: 'string.octal(length=5)',
        sampleReturnValue: '0o35021',
        description: 'Shows string.octal using length.',
      },
      {
        functionCall: 'string.octal(prefix="PRE-")',
        sampleReturnValue: 'PRE-3',
        description: 'Shows string.octal using prefix.',
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

export { STRING_OCTAL_KEYWORD_DEFINITION };
