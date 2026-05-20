const DOMAIN_FAKER_FOOD_KEYWORD_DEFINITIONS = [
  {
    keyword: 'food.adjective',
    delegate: {
      type: 'faker',
      target: 'food.adjective',
    },
    help: {
      summary: 'Generates a random dish adjective.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'salty',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.description',
    delegate: {
      type: 'faker',
      target: 'food.description',
    },
    help: {
      summary: 'Generates a random dish description.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'Fresh mixed greens tossed with pimento-rubbed pigeon, bean shoots, and a light dressing.',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.dish',
    delegate: {
      type: 'faker',
      target: 'food.dish',
    },
    help: {
      summary: 'Generates a random dish name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'Chicken Fajitas',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.ethnicCategory',
    delegate: {
      type: 'faker',
      target: 'food.ethnicCategory',
    },
    help: {
      summary: "Generates a random food's ethnic category.",
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'Lithuanian',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.fruit',
    delegate: {
      type: 'faker',
      target: 'food.fruit',
    },
    help: {
      summary: 'Generates a random fruit name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'snowpea',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.ingredient',
    delegate: {
      type: 'faker',
      target: 'food.ingredient',
    },
    help: {
      summary: 'Generates a random ingredient name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'spelt',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.meat',
    delegate: {
      type: 'faker',
      target: 'food.meat',
    },
    help: {
      summary: 'Generates a random meat',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'goose',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.spice',
    delegate: {
      type: 'faker',
      target: 'food.spice',
    },
    help: {
      summary: 'Generates a random spice name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'poudre de colombo',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.vegetable',
    delegate: {
      type: 'faker',
      target: 'food.vegetable',
    },
    help: {
      summary: 'Generates a random vegetable name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'snowpea sprouts',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_FOOD_KEYWORD_DEFINITIONS };
