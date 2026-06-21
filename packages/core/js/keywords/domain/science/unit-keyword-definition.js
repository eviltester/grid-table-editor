import { validateObjectValue } from '../../../command-help/command-help-validators.js';

const SCIENCE_UNIT_KEYWORD_DEFINITION = {
  keyword: 'science.unit',
  delegate: {
    type: 'faker',
    target: 'science.unit',
  },
  help: {
    summary: 'Returns a random scientific unit.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/science',
    fakerDocsUrl: 'https://fakerjs.dev/api/science',
    validator: validateObjectValue,
    returnType: 'object',
    usageExamples: [
      {
        functionCall: 'science.unit',
        sampleReturnValue: {
          name: 'watt',
          symbol: 'W',
        },
        description: 'Shows the default science.unit call.',
      },
    ],
    args: [],
  },
};

export { SCIENCE_UNIT_KEYWORD_DEFINITION };
