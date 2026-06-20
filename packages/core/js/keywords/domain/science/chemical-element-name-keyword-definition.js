import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SCIENCE_CHEMICAL_ELEMENT_NAME_KEYWORD_DEFINITION = {
  keyword: 'science.chemicalElement.name',
  delegate: {
    type: 'faker',
    target: 'science.chemicalElement',
    resultPath: 'name',
  },
  help: {
    summary: 'Generate a chemical element name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/science',
    fakerDocsUrl: 'https://fakerjs.dev/api/science',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'science.chemicalElement.name',
        sampleReturnValue: 'Tin',
        description: 'Shows the default science.chemicalElement.name call.',
      },
    ],
    args: [],
  },
};

export { SCIENCE_CHEMICAL_ELEMENT_NAME_KEYWORD_DEFINITION };
