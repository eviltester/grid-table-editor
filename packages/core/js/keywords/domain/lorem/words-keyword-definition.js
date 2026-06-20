import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOREM_WORDS_KEYWORD_DEFINITION = {
  keyword: 'lorem.words',
  delegate: {
    type: 'faker',
    target: 'lorem.words',
  },
  help: {
    summary: 'Generates a space separated list of words.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
    fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'lorem.words()',
        sampleReturnValue: 'cur suppellex a',
        description: 'Shows lorem.words when optional params are omitted.',
      },
      {
        functionCall: 'lorem.words(max=10, min=1)',
        sampleReturnValue: 'cur',
        description: 'Shows lorem.words using min.',
      },
      {
        functionCall: 'lorem.words(max=5)',
        sampleReturnValue: 'cur suppellex a',
        description: 'Shows lorem.words using max.',
      },
      {
        functionCall: 'lorem.words(wordCount=5)',
        sampleReturnValue: 'cur suppellex a',
        description: 'Shows lorem.words using wordCount.',
      },
      {
        functionCall: 'lorem.words(wordCountMax=5)',
        sampleReturnValue: 'cur suppellex a',
        description: 'Shows lorem.words using wordCountMax.',
      },
      {
        functionCall: 'lorem.words(wordCountMin=5)',
        sampleReturnValue: 'cur suppellex a',
        description: 'Shows lorem.words using wordCountMin.',
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

export { LOREM_WORDS_KEYWORD_DEFINITION };
