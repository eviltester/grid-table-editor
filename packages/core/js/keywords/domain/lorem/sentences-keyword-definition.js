import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOREM_SENTENCES_KEYWORD_DEFINITION = {
  keyword: 'lorem.sentences',
  delegate: {
    type: 'faker',
    target: 'lorem.sentences',
  },
  help: {
    summary: 'Generates the given number of sentences.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
    fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'lorem.sentences()',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.',
        description: 'Shows lorem.sentences when optional params are omitted.',
      },
      {
        functionCall: 'lorem.sentences(max=10, min=1)',
        sampleReturnValue: 'Suppellex a cognatus arca aliquam audentia.',
        description: 'Shows lorem.sentences using min.',
      },
      {
        functionCall: 'lorem.sentences(max=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit.5Stillicidium bardus utrimque acsi spargo cur.5Aqua avaritia thesaurus volo combibo stultus utor.5Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.',
        description: 'Shows lorem.sentences using max.',
      },
      {
        functionCall: 'lorem.sentences(sentenceCount=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.',
        description: 'Shows lorem.sentences using sentenceCount.',
      },
      {
        functionCall: 'lorem.sentences(separator="-")',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.',
        description: 'Shows lorem.sentences using separator.',
      },
      {
        functionCall: 'lorem.sentences(sentenceCountMax=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.',
        description: 'Shows lorem.sentences using sentenceCountMax.',
      },
      {
        functionCall: 'lorem.sentences(sentenceCountMin=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.',
        description: 'Shows lorem.sentences using sentenceCountMin.',
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
        name: 'sentenceCount',
        type: 'number',
        required: false,
        description: 'Number of sentences to generate.',
      },
      {
        name: 'separator',
        type: 'string',
        required: false,
        description: 'Separator inserted between generated items.',
      },
      {
        name: 'sentenceCountMax',
        type: 'number',
        required: false,
        description: 'The maximum number of sentences to generate.',
      },
      {
        name: 'sentenceCountMin',
        type: 'number',
        required: false,
        description: 'The minimum number of sentences to generate.',
      },
    ],
  },
};

export { LOREM_SENTENCES_KEYWORD_DEFINITION };
