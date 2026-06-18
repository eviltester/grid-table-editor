import {
  validateIntegerValue,
  validateObjectValue,
  validateStringValue,
} from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_SCIENCE_KEYWORD_DEFINITIONS = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

export { DOMAIN_FAKER_SCIENCE_KEYWORD_DEFINITIONS };
