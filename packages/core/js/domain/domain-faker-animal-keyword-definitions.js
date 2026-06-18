import { validateStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_ANIMAL_KEYWORD_DEFINITIONS = [
  {
    keyword: 'animal.bear',
    delegate: {
      type: 'faker',
      target: 'animal.bear',
    },
    help: {
      summary: 'Returns a random bear species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.bear',
          sampleReturnValue: 'Giant panda',
          description: 'Shows the default animal.bear call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.bird',
    delegate: {
      type: 'faker',
      target: 'animal.bird',
    },
    help: {
      summary: 'Returns a random bird species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.bird',
          sampleReturnValue: 'Great-tailed Grackle',
          description: 'Shows the default animal.bird call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.cat',
    delegate: {
      type: 'faker',
      target: 'animal.cat',
    },
    help: {
      summary: 'Returns a random cat breed.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.cat',
          sampleReturnValue: 'Korat',
          description: 'Shows the default animal.cat call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.cetacean',
    delegate: {
      type: 'faker',
      target: 'animal.cetacean',
    },
    help: {
      summary: 'Returns a random cetacean species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.cetacean',
          sampleReturnValue: 'Guiana Dolphin',
          description: 'Shows the default animal.cetacean call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.cow',
    delegate: {
      type: 'faker',
      target: 'animal.cow',
    },
    help: {
      summary: 'Returns a random cow species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.cow',
          sampleReturnValue: 'Gascon cattle',
          description: 'Shows the default animal.cow call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.crocodilia',
    delegate: {
      type: 'faker',
      target: 'animal.crocodilia',
    },
    help: {
      summary: 'Returns a random crocodilian species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.crocodilia',
          sampleReturnValue: 'Gharial',
          description: 'Shows the default animal.crocodilia call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.dog',
    delegate: {
      type: 'faker',
      target: 'animal.dog',
    },
    help: {
      summary: 'Returns a random dog breed.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.dog',
          sampleReturnValue: 'Grand Bleu de Gascogne',
          description: 'Shows the default animal.dog call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.fish',
    delegate: {
      type: 'faker',
      target: 'animal.fish',
    },
    help: {
      summary: 'Returns a random fish species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.fish',
          sampleReturnValue: 'Gazami crab',
          description: 'Shows the default animal.fish call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.horse',
    delegate: {
      type: 'faker',
      target: 'animal.horse',
    },
    help: {
      summary: 'Returns a random horse breed.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.horse',
          sampleReturnValue: 'Heihe Horse',
          description: 'Shows the default animal.horse call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.insect',
    delegate: {
      type: 'faker',
      target: 'animal.insect',
    },
    help: {
      summary: 'Returns a random insect species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.insect',
          sampleReturnValue: 'Honey bee',
          description: 'Shows the default animal.insect call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.lion',
    delegate: {
      type: 'faker',
      target: 'animal.lion',
    },
    help: {
      summary: 'Returns a random lion species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.lion',
          sampleReturnValue: 'Cape lion',
          description: 'Shows the default animal.lion call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.petName',
    delegate: {
      type: 'faker',
      target: 'animal.petName',
    },
    help: {
      summary: 'Returns a random pet name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.petName',
          sampleReturnValue: 'Gus',
          description: 'Shows the default animal.petName call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.rabbit',
    delegate: {
      type: 'faker',
      target: 'animal.rabbit',
    },
    help: {
      summary: 'Returns a random rabbit species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.rabbit',
          sampleReturnValue: 'Florida White',
          description: 'Shows the default animal.rabbit call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.rodent',
    delegate: {
      type: 'faker',
      target: 'animal.rodent',
    },
    help: {
      summary: 'Returns a random rodent breed.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.rodent',
          sampleReturnValue: 'Fukomys foxi',
          description: 'Shows the default animal.rodent call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.snake',
    delegate: {
      type: 'faker',
      target: 'animal.snake',
    },
    help: {
      summary: 'Returns a random snake species.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.snake',
          sampleReturnValue: 'Harlequin coral snake',
          description: 'Shows the default animal.snake call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'animal.type',
    delegate: {
      type: 'faker',
      target: 'animal.type',
    },
    help: {
      summary: 'Returns a random animal type.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/animal',
      fakerDocsUrl: 'https://fakerjs.dev/api/animal',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'animal.type',
          sampleReturnValue: 'giraffe',
          description: 'Shows the default animal.type call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_ANIMAL_KEYWORD_DEFINITIONS };
