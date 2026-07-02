import { validateSymbolStringValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const validateStringSymbolArgs = createPositiveIntegerArgsValidator(['length']);

const STRING_SYMBOL_KEYWORD_DEFINITION = {
  keyword: 'string.symbol',
  delegate: {
    type: 'faker',
    target: 'string.symbol',
  },
  help: {
    summary:
      'Returns a string containing only ASCII symbol characters such as !, ", #, $, %, &, (, ), *, +, -, /, :, ;, <, =, >, ?, @, [, \\, ], ^, _, `, {, |, }, and ~.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateSymbolStringValue,
    argsValidator: validateStringSymbolArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.symbol()',
        sampleReturnValue: '.',
        description: 'Shows string.symbol when optional params are omitted.',
      },
      {
        functionCall: 'string.symbol(length=5)',
        sampleReturnValue: '.\\!*%',
        description: 'Shows string.symbol using length.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: 'Exact number of characters to generate.',
      },
    ],
  },
};

export { STRING_SYMBOL_KEYWORD_DEFINITION };
