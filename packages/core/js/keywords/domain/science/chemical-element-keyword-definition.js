import { validateObjectValue } from '../../../command-help/command-help-validators.js';

const SCIENCE_CHEMICAL_ELEMENT_KEYWORD_DEFINITION = {
  keyword: 'science.chemicalElement',
  delegate: {
    type: 'faker',
    target: 'science.chemicalElement',
  },
  help: {
    summary: 'Generate a value using faker science.chemicalElement.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/science',
    fakerDocsUrl: 'https://fakerjs.dev/api/science',
    validator: validateObjectValue,
    returnType: 'object',
    usageExamples: [
      {
        functionCall: 'science.chemicalElement',
        sampleReturnValue: {
          symbol: 'Sn',
          name: 'Tin',
          atomicNumber: 50,
        },
        description: 'Shows the default science.chemicalElement call.',
      },
    ],
    args: [],
  },
};

export { SCIENCE_CHEMICAL_ELEMENT_KEYWORD_DEFINITION };
