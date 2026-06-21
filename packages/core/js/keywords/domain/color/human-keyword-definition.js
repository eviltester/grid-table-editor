import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COLOR_HUMAN_KEYWORD_DEFINITION = {
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
};

export { COLOR_HUMAN_KEYWORD_DEFINITION };
