import { validateIntegerValue } from '../../../command-help/command-help-validators.js';

const SCIENCE_CHEMICAL_ELEMENT_ATOMIC_NUMBER_KEYWORD_DEFINITION = {
  keyword: 'science.chemicalElement.atomicNumber',
  delegate: {
    type: 'faker',
    target: 'science.chemicalElement',
    resultPath: 'atomicNumber',
  },
  help: {
    summary: 'Generate a chemical element atomic number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/science',
    fakerDocsUrl: 'https://fakerjs.dev/api/science',
    validator: validateIntegerValue,
    returnType: 'integer',
    usageExamples: [
      {
        functionCall: 'science.chemicalElement.atomicNumber',
        sampleReturnValue: 50,
        description: 'Shows the default science.chemicalElement.atomicNumber call.',
      },
    ],
    args: [],
  },
};

export { SCIENCE_CHEMICAL_ELEMENT_ATOMIC_NUMBER_KEYWORD_DEFINITION };
