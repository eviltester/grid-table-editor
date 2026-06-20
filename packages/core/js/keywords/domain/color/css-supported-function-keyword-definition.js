import { createStringEnumValidator } from '../../../command-help/command-help-validators.js';

const CSS_SUPPORTED_FUNCTION_RETURN_TYPE = 'rgb|rgba|hsl|hsla|hwb|cmyk|lab|lch|color';

const validateCssSupportedFunctionValue = createStringEnumValidator(CSS_SUPPORTED_FUNCTION_RETURN_TYPE.split('|'));

const COLOR_CSS_SUPPORTED_FUNCTION_KEYWORD_DEFINITION = {
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
};

export { COLOR_CSS_SUPPORTED_FUNCTION_KEYWORD_DEFINITION };
