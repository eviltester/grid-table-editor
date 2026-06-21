import { validateArrayOrStringValue } from '../../../command-help/command-help-validators.js';

const COLOR_FORMAT_TYPE = 'decimal|css|binary';

const COLOR_LCH_KEYWORD_DEFINITION = {
  keyword: 'color.lch',
  delegate: {
    type: 'faker',
    target: 'color.lch',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns an LCH color.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
    fakerDocsUrl: 'https://fakerjs.dev/api/color',
    validator: validateArrayOrStringValue,
    returnType: 'array|string',
    usageExamples: [
      {
        functionCall: 'color.lch()',
        sampleReturnValue: [0.417022, 165.7, 0],
        description: 'Shows color.lch when optional params are omitted.',
      },
      {
        functionCall: 'color.lch(format="decimal")',
        sampleReturnValue: [0.417022, 165.7, 0],
        description: 'Shows color.lch using format.',
      },
    ],
    args: [
      {
        name: 'format',
        type: COLOR_FORMAT_TYPE,
        required: false,
        description: 'Format of generated RGB color.',
      },
    ],
  },
};

export { COLOR_LCH_KEYWORD_DEFINITION };
