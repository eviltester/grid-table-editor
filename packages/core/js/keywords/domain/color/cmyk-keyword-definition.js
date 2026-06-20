import { validateArrayOrStringValue } from '../../../command-help/command-help-validators.js';

const COLOR_FORMAT_TYPE = 'decimal|css|binary';

const COLOR_CMYK_KEYWORD_DEFINITION = {
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
};

export { COLOR_CMYK_KEYWORD_DEFINITION };
