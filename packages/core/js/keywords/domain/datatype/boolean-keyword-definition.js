import { validateBooleanValue } from '../../../command-help/command-help-validators.js';
import { createNumericArgRangeValidator } from '../../../domain/domain-keyword-arg-validators.js';

const validateBooleanProbability = createNumericArgRangeValidator({
  argName: 'probability',
  min: 0,
  max: 1,
  description: 'Invalid keyword arguments: argument "probability" must be between 0 and 1',
});

const DATATYPE_BOOLEAN_KEYWORD_DEFINITION = {
  keyword: 'datatype.boolean',
  delegate: {
    type: 'faker',
    target: 'datatype.boolean',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns the boolean value true or false.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/datatype',
    fakerDocsUrl: 'https://fakerjs.dev/api/datatype',
    validator: validateBooleanValue,
    argsValidator: validateBooleanProbability,
    returnType: 'boolean',
    usageExamples: [
      {
        functionCall: 'datatype.boolean()',
        sampleReturnValue: true,
        description: 'Shows datatype.boolean when optional params are omitted.',
      },
      {
        functionCall: 'datatype.boolean(probability=0.5)',
        sampleReturnValue: true,
        description: 'Shows datatype.boolean using probability.',
      },
    ],
    args: [
      {
        name: 'probability',
        type: 'number',
        required: false,
        description: 'Probability threshold for returning true (between 0 and 1).',
      },
    ],
  },
};

export { DATATYPE_BOOLEAN_KEYWORD_DEFINITION };
