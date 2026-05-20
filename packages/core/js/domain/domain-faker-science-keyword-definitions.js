const DOMAIN_FAKER_SCIENCE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'science.chemicalElement',
    delegate: {
      type: 'faker',
      target: 'science.chemicalElement',
    },
    help: {
      summary: 'Generate a value using faker science.chemicalElement.',
      docsUrl: 'https://fakerjs.dev/api/science',
      example: '{"name":"Oxygen","symbol":"O","atomicNumber":8}',
      returnType: 'object',
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
      docsUrl: 'https://fakerjs.dev/api/science',
      example: '8',
      returnType: 'integer',
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
      docsUrl: 'https://fakerjs.dev/api/science',
      example: 'Oxygen',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/science',
      example: 'O',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/science',
      example: '{"name":"farad","symbol":"F"}',
      returnType: 'object',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_SCIENCE_KEYWORD_DEFINITIONS };
