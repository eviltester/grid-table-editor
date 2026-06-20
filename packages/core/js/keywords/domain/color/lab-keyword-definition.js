import { validateArrayOrStringValue } from '../../../command-help/command-help-validators.js';

const COLOR_FORMAT_TYPE = 'decimal|css|binary';

const COLOR_LAB_KEYWORD_DEFINITION = {
  keyword: 'color.lab',
  delegate: {
    type: 'faker',
    target: 'color.lab',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a LAB (CIELAB) color.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
    fakerDocsUrl: 'https://fakerjs.dev/api/color',
    validator: validateArrayOrStringValue,
    returnType: 'array|string',
    usageExamples: [
      {
        functionCall: 'color.lab()',
        sampleReturnValue: [0.417022, 44.0649, -99.9772],
        description: 'Shows color.lab when optional params are omitted.',
      },
      {
        functionCall: 'color.lab(format="decimal")',
        sampleReturnValue: [0.417022, 44.0649, -99.9772],
        description: 'Shows color.lab using format.',
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

export { COLOR_LAB_KEYWORD_DEFINITION };
