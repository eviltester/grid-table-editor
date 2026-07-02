import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createLoremCountArgsValidator } from './lorem-arg-validators.js';

const validateLoremParagraphArgs = createLoremCountArgsValidator({
  countName: 'sentenceCount',
  minName: 'sentenceCountMin',
  maxName: 'sentenceCountMax',
});

const LOREM_PARAGRAPH_KEYWORD_DEFINITION = {
  keyword: 'lorem.paragraph',
  delegate: {
    type: 'faker',
    target: 'lorem.paragraph',
    argTransform: 'loremCountFromHelpArgs',
  },
  help: {
    summary: 'Generates a paragraph with the given number of sentences.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
    fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
    validator: validateStringValue,
    argsValidator: validateLoremParagraphArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'lorem.paragraph()',
        sampleReturnValue:
          'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.',
        description: 'Shows lorem.paragraph when optional params are omitted.',
      },
      {
        functionCall: 'lorem.paragraph(max=10, min=1)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet.',
        description: 'Shows lorem.paragraph using min.',
      },
      {
        functionCall: 'lorem.paragraph(max=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.',
        description: 'Shows lorem.paragraph using max.',
      },
      {
        functionCall: 'lorem.paragraph(sentenceCount=5)',
        sampleReturnValue:
          'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus. Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo.',
        description: 'Shows lorem.paragraph using sentenceCount.',
      },
      {
        functionCall: 'lorem.paragraph(sentenceCountMax=5)',
        sampleReturnValue:
          'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.',
        description: 'Shows lorem.paragraph using sentenceCountMax.',
      },
      {
        functionCall: 'lorem.paragraph(sentenceCountMin=5)',
        sampleReturnValue:
          'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus. Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo.',
        description: 'Shows lorem.paragraph using sentenceCountMin.',
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

export { LOREM_PARAGRAPH_KEYWORD_DEFINITION };
