import { validateStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_COMPANY_KEYWORD_DEFINITIONS = [
  {
    keyword: 'company.buzzAdjective',
    delegate: {
      type: 'faker',
      target: 'company.buzzAdjective',
    },
    help: {
      summary: 'Returns a random buzz adjective that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
      fakerDocsUrl: 'https://fakerjs.dev/api/company',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'company.buzzAdjective',
          sampleReturnValue: 'immersive',
          description: 'Shows the default company.buzzAdjective call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'company.buzzNoun',
    delegate: {
      type: 'faker',
      target: 'company.buzzNoun',
    },
    help: {
      summary: 'Returns a random buzz noun that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
      fakerDocsUrl: 'https://fakerjs.dev/api/company',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'company.buzzNoun',
          sampleReturnValue: 'interfaces',
          description: 'Shows the default company.buzzNoun call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'company.buzzPhrase',
    delegate: {
      type: 'faker',
      target: 'company.buzzPhrase',
    },
    help: {
      summary: 'Generates a random buzz phrase that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
      fakerDocsUrl: 'https://fakerjs.dev/api/company',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'company.buzzPhrase',
          sampleReturnValue: 'grow robust AI',
          description: 'Shows the default company.buzzPhrase call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'company.buzzVerb',
    delegate: {
      type: 'faker',
      target: 'company.buzzVerb',
    },
    help: {
      summary: 'Returns a random buzz verb that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
      fakerDocsUrl: 'https://fakerjs.dev/api/company',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'company.buzzVerb',
          sampleReturnValue: 'grow',
          description: 'Shows the default company.buzzVerb call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'company.catchPhrase',
    delegate: {
      type: 'faker',
      target: 'company.catchPhrase',
    },
    help: {
      summary: 'Generates a random catch phrase that can be displayed to an end user.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
      fakerDocsUrl: 'https://fakerjs.dev/api/company',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'company.catchPhrase',
          sampleReturnValue: 'Integrated radical ability',
          description: 'Shows the default company.catchPhrase call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'company.catchPhraseAdjective',
    delegate: {
      type: 'faker',
      target: 'company.catchPhraseAdjective',
    },
    help: {
      summary: 'Returns a random catch phrase adjective that can be displayed to an end user.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
      fakerDocsUrl: 'https://fakerjs.dev/api/company',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'company.catchPhraseAdjective',
          sampleReturnValue: 'Integrated',
          description: 'Shows the default company.catchPhraseAdjective call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'company.catchPhraseDescriptor',
    delegate: {
      type: 'faker',
      target: 'company.catchPhraseDescriptor',
    },
    help: {
      summary: 'Returns a random catch phrase descriptor that can be displayed to an end user.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
      fakerDocsUrl: 'https://fakerjs.dev/api/company',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'company.catchPhraseDescriptor',
          sampleReturnValue: 'heuristic',
          description: 'Shows the default company.catchPhraseDescriptor call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'company.catchPhraseNoun',
    delegate: {
      type: 'faker',
      target: 'company.catchPhraseNoun',
    },
    help: {
      summary: 'Returns a random catch phrase noun that can be displayed to an end user.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
      fakerDocsUrl: 'https://fakerjs.dev/api/company',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'company.catchPhraseNoun',
          sampleReturnValue: 'generative AI',
          description: 'Shows the default company.catchPhraseNoun call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'company.name',
    delegate: {
      type: 'faker',
      target: 'company.name',
    },
    help: {
      summary: 'Generates a random company name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
      fakerDocsUrl: 'https://fakerjs.dev/api/company',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'company.name',
          sampleReturnValue: 'Gutmann Group',
          description: 'Shows the default company.name call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_COMPANY_KEYWORD_DEFINITIONS };
