import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createLoremCountArgsValidator } from './lorem-arg-validators.js';

const validateLoremSentencesArgs = createLoremCountArgsValidator({
  countName: 'sentenceCount',
  minName: 'sentenceCountMin',
  maxName: 'sentenceCountMax',
});

const LOREM_SENTENCES_KEYWORD_DEFINITION = {
  keyword: 'lorem.sentences',
  delegate: {
    type: 'faker',
    target: 'lorem.sentences',
    argTransform: 'loremCountFromHelpArgs',
  },
  help: {
    summary: 'Generates the given number of sentences.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
    fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
    validator: validateStringValue,
    argsValidator: validateLoremSentencesArgs,
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
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet.',
        description: 'Shows lorem.sentences using min.',
      },
      {
        functionCall: 'lorem.sentences(max=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.',
        description: 'Shows lorem.sentences using max.',
      },
      {
        functionCall: 'lorem.sentences(sentenceCount=5)',
        sampleReturnValue:
          'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus. Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo.',
        description: 'Shows lorem.sentences using sentenceCount.',
      },
      {
        functionCall: 'lorem.sentences(separator="-")',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit.-Stillicidium bardus utrimque acsi spargo cur.-Aqua avaritia thesaurus volo combibo stultus utor.-Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.',
        description: 'Shows lorem.sentences using separator.',
      },
      {
        functionCall: 'lorem.sentences(sentenceCountMax=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.',
        description: 'Shows lorem.sentences using sentenceCountMax.',
      },
      {
        functionCall: 'lorem.sentences(sentenceCountMin=5)',
        sampleReturnValue:
          'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus. Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo.',
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
