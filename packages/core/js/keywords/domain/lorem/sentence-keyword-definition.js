import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createLoremCountArgsValidator } from './lorem-arg-validators.js';

const validateLoremSentenceArgs = createLoremCountArgsValidator({
  countName: 'wordCount',
  minName: 'wordCountMin',
  maxName: 'wordCountMax',
});

const LOREM_SENTENCE_KEYWORD_DEFINITION = {
  keyword: 'lorem.sentence',
  delegate: {
    type: 'faker',
    target: 'lorem.sentence',
    argTransform: 'loremCountFromHelpArgs',
  },
  help: {
    summary: 'Generates a space separated list of words beginning with a capital letter and ending with a period.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
    fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
    validator: validateStringValue,
    argsValidator: validateLoremSentenceArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'lorem.sentence()',
        sampleReturnValue: 'Suppellex a cognatus arca aliquam audentia.',
        description: 'Shows lorem.sentence when optional params are omitted.',
      },
      {
        functionCall: 'lorem.sentence(max=10, min=1)',
        sampleReturnValue: 'Suppellex a cognatus arca aliquam.',
        description: 'Shows lorem.sentence using min.',
      },
      {
        functionCall: 'lorem.sentence(max=5)',
        sampleReturnValue: 'Suppellex a cognatus.',
        description: 'Shows lorem.sentence using max.',
      },
      {
        functionCall: 'lorem.sentence(wordCount=5)',
        sampleReturnValue: 'Cur suppellex a cognatus arca.',
        description: 'Shows lorem.sentence using wordCount.',
      },
      {
        functionCall: 'lorem.sentence(wordCountMax=5)',
        sampleReturnValue: 'Suppellex a cognatus.',
        description: 'Shows lorem.sentence using wordCountMax.',
      },
      {
        functionCall: 'lorem.sentence(wordCountMin=5)',
        sampleReturnValue: 'Cur suppellex a cognatus arca.',
        description: 'Shows lorem.sentence using wordCountMin.',
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

export { LOREM_SENTENCE_KEYWORD_DEFINITION };
