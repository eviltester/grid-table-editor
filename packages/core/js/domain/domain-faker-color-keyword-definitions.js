import {
  createStringEnumValidator,
  validateArrayOrStringValue,
  validateStringValue,
} from '../command-help/command-help-validators.js';

const COLOR_FORMAT_TYPE = 'decimal|css|binary';
const COLOR_RGB_FORMAT_TYPE = 'hex|decimal|css|binary';
const COLOR_CASING_TYPE = 'lower|upper|mixed';
const CSS_SUPPORTED_FUNCTION_RETURN_TYPE = 'rgb|rgba|hsl|hsla|hwb|cmyk|lab|lch|color';
const CSS_SUPPORTED_SPACE_RETURN_TYPE = 'sRGB|display-p3|rec2020|a98-rgb|prophoto-rgb';
const validateCssSupportedFunctionValue = createStringEnumValidator(CSS_SUPPORTED_FUNCTION_RETURN_TYPE.split('|'));
const validateCssSupportedSpaceValue = createStringEnumValidator(CSS_SUPPORTED_SPACE_RETURN_TYPE.split('|'));

const DOMAIN_FAKER_COLOR_KEYWORD_DEFINITIONS = [
  {
    keyword: 'color.cmyk',
    delegate: {
      type: 'faker',
      target: 'color.cmyk',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a CMYK color.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
      fakerDocsUrl: 'https://fakerjs.dev/api/color',
      validator: validateArrayOrStringValue,
      returnType: 'array|string',
      usageExamples: [
        {
          functionCall: 'color.cmyk()',
          sampleReturnValue: [0.42, 0.72, 0, 0.3],
          description: 'Shows color.cmyk when optional params are omitted.',
        },
        {
          functionCall: 'color.cmyk(format="decimal")',
          sampleReturnValue: [0.42, 0.72, 0, 0.3],
          description: 'Shows color.cmyk using format.',
        },
      ],
      args: [
        {
          name: 'format',
          type: COLOR_FORMAT_TYPE,
          required: false,
          description: 'Format of generated CMYK color.',
        },
      ],
    },
  },
  {
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
  },
  {
    keyword: 'color.cssSupportedFunction',
    delegate: {
      type: 'faker',
      target: 'color.cssSupportedFunction',
    },
    help: {
      summary: 'Returns a random css supported color function name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
      fakerDocsUrl: 'https://fakerjs.dev/api/color',
      validator: validateCssSupportedFunctionValue,
      returnType: CSS_SUPPORTED_FUNCTION_RETURN_TYPE,
      usageExamples: [
        {
          functionCall: 'color.cssSupportedFunction',
          sampleReturnValue: 'hsla',
          description: 'Shows the default color.cssSupportedFunction call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'color.cssSupportedSpace',
    delegate: {
      type: 'faker',
      target: 'color.cssSupportedSpace',
    },
    help: {
      summary: 'Returns a random css supported color space name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
      fakerDocsUrl: 'https://fakerjs.dev/api/color',
      validator: validateCssSupportedSpaceValue,
      returnType: CSS_SUPPORTED_SPACE_RETURN_TYPE,
      usageExamples: [
        {
          functionCall: 'color.cssSupportedSpace',
          sampleReturnValue: 'rec2020',
          description: 'Shows the default color.cssSupportedSpace call.',
        },
      ],
      args: [],
    },
  },
  {
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
  },
  {
    keyword: 'color.human',
    delegate: {
      type: 'faker',
      target: 'color.human',
    },
    help: {
      summary: 'Returns a random human-readable color name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
      fakerDocsUrl: 'https://fakerjs.dev/api/color',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'color.human',
          sampleReturnValue: 'magenta',
          description: 'Shows the default color.human call.',
        },
      ],
      args: [],
    },
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    keyword: 'color.rgb',
    delegate: {
      type: 'faker',
      target: 'color.rgb',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns an RGB color.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
      fakerDocsUrl: 'https://fakerjs.dev/api/color',
      validator: validateArrayOrStringValue,
      returnType: 'array|string',
      usageExamples: [
        {
          functionCall: 'color.rgb()',
          sampleReturnValue: '#9f0632',
          description: 'Shows color.rgb when optional params are omitted.',
        },
        {
          functionCall: 'color.rgb(casing="upper")',
          sampleReturnValue: '#9F0632',
          description: 'Shows color.rgb using casing.',
        },
        {
          functionCall: 'color.rgb(format="hex")',
          sampleReturnValue: '#9f0632',
          description: 'Shows color.rgb using format.',
        },
        {
          functionCall: 'color.rgb(includeAlpha=true)',
          sampleReturnValue: '#9f063247',
          description: 'Shows color.rgb using includeAlpha.',
        },
        {
          functionCall: 'color.rgb(prefix="#")',
          sampleReturnValue: '#9f0632',
          description: 'Shows color.rgb using prefix.',
        },
      ],
      args: [
        {
          name: 'casing',
          type: COLOR_CASING_TYPE,
          required: false,
          description: "Letter type case of the generated hex color. Only applied when 'hex' format is used.",
          examples: ['upper'],
        },
        {
          name: 'format',
          type: COLOR_RGB_FORMAT_TYPE,
          required: false,
          description: 'Format of generated RGB color.',
          examples: ['hex'],
        },
        {
          name: 'includeAlpha',
          type: 'boolean',
          required: false,
          description: 'Adds an alpha value to the color (RGBA).',
          examples: [true],
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: "Prefix of the generated hex color. Only applied when 'hex' format is used.",
          examples: ['#'],
        },
      ],
    },
  },
  {
    keyword: 'color.space',
    delegate: {
      type: 'faker',
      target: 'color.space',
    },
    help: {
      summary: 'Returns a random color space name from the worldwide accepted color spaces.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/color',
      fakerDocsUrl: 'https://fakerjs.dev/api/color',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'color.space',
          sampleReturnValue: 'HSV',
          description: 'Shows the default color.space call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_COLOR_KEYWORD_DEFINITIONS };
