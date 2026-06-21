import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SCIENCE_UNIT_SYMBOL_KEYWORD_DEFINITION = {
  keyword: 'science.unit.symbol',
  delegate: {
    type: 'faker',
    target: 'science.unit',
    resultPath: 'symbol',
  },
  help: {
    summary: 'Generate a scientific unit symbol.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/science',
    fakerDocsUrl: 'https://fakerjs.dev/api/science',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'science.unit.symbol',
        sampleReturnValue: 'W',
        description: 'Shows the default science.unit.symbol call.',
      },
    ],
    args: [],
  },
};

export { SCIENCE_UNIT_SYMBOL_KEYWORD_DEFINITION };
