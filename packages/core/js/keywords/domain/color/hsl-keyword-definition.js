import { validateArrayOrStringValue } from '../../../command-help/command-help-validators.js';

const COLOR_FORMAT_TYPE = 'decimal|css|binary';

const COLOR_HSL_KEYWORD_DEFINITION = {
  keyword: 'color.hsl',
  delegate: {
    type: 'faker',
    target: 'color.hsl',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns an HSL color.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
    fakerDocsUrl: 'https://fakerjs.dev/api/color',
    validator: validateArrayOrStringValue,
    returnType: 'array|string',
    usageExamples: [
      {
        functionCall: 'color.hsl',
        sampleReturnValue: [150, 0.72, 0],
        description: 'Shows color.hsl returning the default tuple output.',
      },
      {
        functionCall: 'color.hsl(format="css")',
        sampleReturnValue: 'hsl(150deg 72% 0%)',
        description: 'Shows color.hsl returning CSS text without alpha.',
      },
      {
        functionCall: 'color.hsl(includeAlpha=true)',
        sampleReturnValue: [150, 0.72, 0, 0.3],
        description: 'Shows color.hsl including alpha while keeping the tuple-style output.',
      },
      {
        functionCall: 'color.hsl(format="css", includeAlpha=true)',
        sampleReturnValue: 'hsl(150deg 72% 0% / 30)',
        description: 'Shows color.hsl returning CSS text with alpha included.',
      },
    ],
    args: [
      {
        name: 'format',
        type: COLOR_FORMAT_TYPE,
        required: false,
        description: 'Format of generated HSL color.',
      },
      {
        name: 'includeAlpha',
        type: 'boolean',
        required: false,
        description: 'Adds an alpha value to the color (RGBA).',
      },
    ],
  },
};

export { COLOR_HSL_KEYWORD_DEFINITION };
