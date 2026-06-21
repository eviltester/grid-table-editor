import { validateArrayOrStringValue } from '../../../command-help/command-help-validators.js';

const COLOR_FORMAT_TYPE = 'decimal|css|binary';

const CSS_SUPPORTED_SPACE_RETURN_TYPE = 'sRGB|display-p3|rec2020|a98-rgb|prophoto-rgb';

const COLOR_COLOR_BY_CSSCOLOR_SPACE_KEYWORD_DEFINITION = {
  keyword: 'color.colorByCSSColorSpace',
  delegate: {
    type: 'faker',
    target: 'color.colorByCSSColorSpace',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random color based on CSS color space specified.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
    fakerDocsUrl: 'https://fakerjs.dev/api/color',
    validator: validateArrayOrStringValue,
    returnType: 'array|string',
    usageExamples: [
      {
        functionCall: 'color.colorByCSSColorSpace()',
        sampleReturnValue: [0.417, 0.7203, 0.0001],
        description: 'Shows color.colorByCSSColorSpace when optional params are omitted.',
      },
      {
        functionCall: 'color.colorByCSSColorSpace(format="decimal")',
        sampleReturnValue: [0.417, 0.7203, 0.0001],
        description: 'Shows color.colorByCSSColorSpace using format.',
      },
      {
        functionCall: 'color.colorByCSSColorSpace(space="display-p3")',
        sampleReturnValue: [0.417, 0.7203, 0.0001],
        description: 'Shows color.colorByCSSColorSpace using space.',
      },
    ],
    args: [
      {
        name: 'format',
        type: COLOR_FORMAT_TYPE,
        required: false,
        description: 'Format of generated RGB color.',
      },
      {
        name: 'space',
        type: CSS_SUPPORTED_SPACE_RETURN_TYPE,
        required: false,
        description: 'Color space to generate the color for.',
      },
    ],
  },
};

export { COLOR_COLOR_BY_CSSCOLOR_SPACE_KEYWORD_DEFINITION };
