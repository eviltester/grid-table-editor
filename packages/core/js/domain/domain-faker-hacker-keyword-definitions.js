import { validateStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_HACKER_KEYWORD_DEFINITIONS = [
  {
    keyword: 'hacker.abbreviation',
    delegate: {
      type: 'faker',
      target: 'hacker.abbreviation',
    },
    help: {
      summary: 'Returns a random hacker/IT abbreviation.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
      fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'hacker.abbreviation',
          sampleReturnValue: 'IP',
          description: 'Shows the default hacker.abbreviation call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'hacker.adjective',
    delegate: {
      type: 'faker',
      target: 'hacker.adjective',
    },
    help: {
      summary: 'Returns a random hacker/IT adjective.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
      fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'hacker.adjective',
          sampleReturnValue: 'mobile',
          description: 'Shows the default hacker.adjective call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'hacker.ingverb',
    delegate: {
      type: 'faker',
      target: 'hacker.ingverb',
    },
    help: {
      summary: 'Returns a random hacker/IT verb for continuous actions (en: ing suffix; e.g. hacking).',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
      fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'hacker.ingverb',
          sampleReturnValue: 'generating',
          description: 'Shows the default hacker.ingverb call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'hacker.noun',
    delegate: {
      type: 'faker',
      target: 'hacker.noun',
    },
    help: {
      summary: 'Returns a random hacker/IT noun.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
      fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'hacker.noun',
          sampleReturnValue: 'firewall',
          description: 'Shows the default hacker.noun call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'hacker.phrase',
    delegate: {
      type: 'faker',
      target: 'hacker.phrase',
    },
    help: {
      summary: 'Generates a random hacker/IT phrase.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
      fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'hacker.phrase',
          sampleReturnValue: 'Try to back up the COM bus, maybe it will hack the mobile bus!',
          description: 'Shows the default hacker.phrase call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'hacker.verb',
    delegate: {
      type: 'faker',
      target: 'hacker.verb',
    },
    help: {
      summary: 'Returns a random hacker/IT verb.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/hacker',
      fakerDocsUrl: 'https://fakerjs.dev/api/hacker',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'hacker.verb',
          sampleReturnValue: 'hack',
          description: 'Shows the default hacker.verb call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_HACKER_KEYWORD_DEFINITIONS };
