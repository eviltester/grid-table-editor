import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SCIENCE_CHEMICAL_ELEMENT_SYMBOL_KEYWORD_DEFINITION = {
  keyword: 'science.chemicalElement.symbol',
  delegate: {
    type: 'faker',
    target: 'science.chemicalElement',
    resultPath: 'symbol',
  },
  help: {
    summary: 'Generate a chemical element symbol.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/science',
    fakerDocsUrl: 'https://fakerjs.dev/api/science',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'science.chemicalElement.symbol',
        sampleReturnValue: 'Sn',
        description: 'Shows the default science.chemicalElement.symbol call.',
      },
    ],
    args: [],
  },
};

export { SCIENCE_CHEMICAL_ELEMENT_SYMBOL_KEYWORD_DEFINITION };
