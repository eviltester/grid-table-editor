import { createStringEnumValidator } from '../../../command-help/command-help-validators.js';

const CSS_SUPPORTED_SPACE_RETURN_TYPE = 'sRGB|display-p3|rec2020|a98-rgb|prophoto-rgb';

const validateCssSupportedSpaceValue = createStringEnumValidator(CSS_SUPPORTED_SPACE_RETURN_TYPE.split('|'));

const COLOR_CSS_SUPPORTED_SPACE_KEYWORD_DEFINITION = {
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
};

export { COLOR_CSS_SUPPORTED_SPACE_KEYWORD_DEFINITION };
