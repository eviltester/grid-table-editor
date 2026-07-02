import { validateNumericStringValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const validateStringNumericArgs = createPositiveIntegerArgsValidator(['length']);

const STRING_NUMERIC_KEYWORD_DEFINITION = {
  keyword: 'string.numeric',
  delegate: {
    type: 'faker',
    target: 'string.numeric',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a given length string of digits.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateNumericStringValue,
    argsValidator: validateStringNumericArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.numeric()',
        sampleReturnValue: '4',
        description: 'Shows string.numeric when optional params are omitted.',
      },
      {
        functionCall: 'string.numeric(length=5)',
        sampleReturnValue: '47031',
        description: 'Shows string.numeric using length.',
      },
      {
        functionCall: 'string.numeric(allowLeadingZeros=true)',
        sampleReturnValue: '4',
        description: 'Shows string.numeric using allowLeadingZeros.',
      },
      {
        functionCall: 'string.numeric(exclude=["A","B","C"])',
        sampleReturnValue: '4',
        description: 'Shows string.numeric using exclude.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: 'Desired length of the generated value.',
      },
      {
        name: 'allowLeadingZeros',
        type: 'boolean',
        required: false,
        description: 'Whether leading zeros are allowed or not.',
      },
      {
        name: 'exclude',
        type: 'array',
        required: false,
        description: 'An array of digits which should be excluded in the generated string.',
      },
    ],
  },
};

export { STRING_NUMERIC_KEYWORD_DEFINITION };
