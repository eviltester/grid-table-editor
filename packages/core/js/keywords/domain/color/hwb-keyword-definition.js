import { validateArrayOrStringValue } from '../../../command-help/command-help-validators.js';

const COLOR_FORMAT_TYPE = 'decimal|css|binary';

const COLOR_HWB_KEYWORD_DEFINITION = {
  keyword: 'color.hwb',
  delegate: {
    type: 'faker',
    target: 'color.hwb',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns an HWB color.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
    fakerDocsUrl: 'https://fakerjs.dev/api/color',
    validator: validateArrayOrStringValue,
    returnType: 'array|string',
    usageExamples: [
      {
        functionCall: 'color.hwb()',
        sampleReturnValue: [150, 0.72, 0],
        description: 'Shows color.hwb when optional params are omitted.',
      },
      {
        functionCall: 'color.hwb(format="decimal")',
        sampleReturnValue: [150, 0.72, 0],
        description: 'Shows color.hwb using format.',
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

export { COLOR_HWB_KEYWORD_DEFINITION };
