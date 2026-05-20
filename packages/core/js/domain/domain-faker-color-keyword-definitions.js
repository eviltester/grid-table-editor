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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[0.95,0.17,0.23,1]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
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
    },
    help: {
      summary: 'Returns a random color based on CSS color space specified.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[0.5811,0.0479,0.1091]',
      returnType: 'string',
      args: [],
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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: 'hsla',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: 'sRGB',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[212,0.78,0.54]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: 'green',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[328,0.27,0.33]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[0.071396,-55.6612,-66.7185]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[0.469557,212.9,204.9]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '#ee8222',
      returnType: 'string',
      args: [
        {
          name: 'casing',
          type: 'string',
          required: false,
          description: "Letter type case of the generated hex color. Only applied when 'hex' format is used.",
        },
        {
          name: 'format',
          type: 'string',
          required: false,
          description: 'Format of generated RGB color.',
        },
        {
          name: 'includeAlpha',
          type: 'boolean',
          required: false,
          description: 'Adds an alpha value to the color (RGBA).',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: "Prefix of the generated hex color. Only applied when 'hex' format is used.",
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
      docsUrl: 'https://fakerjs.dev/api/color',
      example: 'HSL',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_COLOR_KEYWORD_DEFINITIONS };
