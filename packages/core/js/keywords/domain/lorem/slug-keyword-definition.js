import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOREM_SLUG_KEYWORD_DEFINITION = {
  keyword: 'lorem.slug',
  delegate: {
    type: 'faker',
    target: 'lorem.slug',
  },
  help: {
    summary: 'Generates a slugified text consisting of the given number of hyphen separated words.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
    fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'lorem.slug()',
        sampleReturnValue: 'cur-suppellex-a',
        description: 'Shows lorem.slug when optional params are omitted.',
      },
      {
        functionCall: 'lorem.slug(max=10, min=1)',
        sampleReturnValue: 'cur',
        description: 'Shows lorem.slug using min.',
      },
      {
        functionCall: 'lorem.slug(max=5)',
        sampleReturnValue: 'cur-suppellex-a',
        description: 'Shows lorem.slug using max.',
      },
      {
        functionCall: 'lorem.slug(wordCount=5)',
        sampleReturnValue: 'cur-suppellex-a',
        description: 'Shows lorem.slug using wordCount.',
      },
      {
        functionCall: 'lorem.slug(wordCountMax=5)',
        sampleReturnValue: 'cur-suppellex-a',
        description: 'Shows lorem.slug using wordCountMax.',
      },
      {
        functionCall: 'lorem.slug(wordCountMin=5)',
        sampleReturnValue: 'cur-suppellex-a',
        description: 'Shows lorem.slug using wordCountMin.',
      },
    ],
    args: [
      {
        name: 'min',
        type: 'number',
        required: false,
        description: 'Minimum bound used when generating a value.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'Maximum bound used when generating a value.',
      },
      {
        name: 'wordCount',
        type: 'number',
        required: false,
        description: 'Number of words to generate.',
      },
      {
        name: 'wordCountMax',
        type: 'number',
        required: false,
        description: 'The maximum number of words to generate.',
      },
      {
        name: 'wordCountMin',
        type: 'number',
        required: false,
        description: 'The minimum number of words to generate.',
      },
    ],
  },
};

export { LOREM_SLUG_KEYWORD_DEFINITION };
