import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COLOR_SPACE_KEYWORD_DEFINITION = {
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
};

export { COLOR_SPACE_KEYWORD_DEFINITION };
