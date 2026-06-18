import { validateStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_FOOD_KEYWORD_DEFINITIONS = [
  {
    keyword: 'food.adjective',
    delegate: {
      type: 'faker',
      target: 'food.adjective',
    },
    help: {
      summary: 'Generates a random dish adjective.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
      fakerDocsUrl: 'https://fakerjs.dev/api/food',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'food.adjective',
          sampleReturnValue: 'juicy',
          description: 'Shows the default food.adjective call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
      fakerDocsUrl: 'https://fakerjs.dev/api/food',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'food.description',
          sampleReturnValue: 'An exquisite artichoke dish, paired with brown rice and a hint of cardamom.',
          description: 'Shows the default food.description call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
      fakerDocsUrl: 'https://fakerjs.dev/api/food',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'food.dish',
          sampleReturnValue: 'Cinnamon-crusted Chicken',
          description: 'Shows the default food.dish call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
      fakerDocsUrl: 'https://fakerjs.dev/api/food',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'food.ethnicCategory',
          sampleReturnValue: 'Indonesian',
          description: 'Shows the default food.ethnicCategory call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
      fakerDocsUrl: 'https://fakerjs.dev/api/food',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'food.fruit',
          sampleReturnValue: 'grapefruit',
          description: 'Shows the default food.fruit call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
      fakerDocsUrl: 'https://fakerjs.dev/api/food',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'food.ingredient',
          sampleReturnValue: 'green pepper',
          description: 'Shows the default food.ingredient call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
      fakerDocsUrl: 'https://fakerjs.dev/api/food',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'food.meat',
          sampleReturnValue: 'kangaroo',
          description: 'Shows the default food.meat call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
      fakerDocsUrl: 'https://fakerjs.dev/api/food',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'food.spice',
          sampleReturnValue: 'fines herbes',
          description: 'Shows the default food.spice call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/food',
      fakerDocsUrl: 'https://fakerjs.dev/api/food',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'food.vegetable',
          sampleReturnValue: 'eggplant',
          description: 'Shows the default food.vegetable call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_FOOD_KEYWORD_DEFINITIONS };
