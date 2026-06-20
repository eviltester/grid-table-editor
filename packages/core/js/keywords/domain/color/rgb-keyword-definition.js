import { validateArrayOrStringValue } from '../../../command-help/command-help-validators.js';

const COLOR_RGB_FORMAT_TYPE = 'hex|decimal|css|binary';

const COLOR_CASING_TYPE = 'lower|upper|mixed';

const COLOR_RGB_KEYWORD_DEFINITION = {
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
};

export { COLOR_RGB_KEYWORD_DEFINITION };
