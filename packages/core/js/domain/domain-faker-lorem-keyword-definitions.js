import { validateStringValue } from '../command-help/command-help-validators.js';

const LOREM_WORD_STRATEGY_TYPE = 'fail|closest|shortest|longest|any-length';

const DOMAIN_FAKER_LOREM_KEYWORD_DEFINITIONS = [
  {
    keyword: 'lorem.lines',
    delegate: {
      type: 'faker',
      target: 'lorem.lines',
    },
    help: {
      summary: "Generates the given number lines of lorem separated by `'\\n'`.",
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
      fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'lorem.lines()',
          sampleReturnValue:
            'A cognatus arca aliquam audentia coniuratio crux fugit.\n' +
            'Stillicidium bardus utrimque acsi spargo cur.\n' +
            'Aqua avaritia thesaurus volo combibo stultus utor.',
          description: 'Shows lorem.lines when optional params are omitted.',
        },
        {
          functionCall: 'lorem.lines(max=10, min=1)',
          sampleReturnValue: 'Suppellex a cognatus arca aliquam audentia.',
          description: 'Shows lorem.lines using min.',
        },
        {
          functionCall: 'lorem.lines(max=5)',
          sampleReturnValue:
            'A cognatus arca aliquam audentia coniuratio crux fugit.\n' +
            'Stillicidium bardus utrimque acsi spargo cur.\n' +
            'Aqua avaritia thesaurus volo combibo stultus utor.',
          description: 'Shows lorem.lines using max.',
        },
        {
          functionCall: 'lorem.lines(lineCount=5)',
          sampleReturnValue:
            'A cognatus arca aliquam audentia coniuratio crux fugit.\n' +
            'Stillicidium bardus utrimque acsi spargo cur.\n' +
            'Aqua avaritia thesaurus volo combibo stultus utor.',
          description: 'Shows lorem.lines using lineCount.',
        },
        {
          functionCall: 'lorem.lines(lineCountMax=5)',
          sampleReturnValue:
            'A cognatus arca aliquam audentia coniuratio crux fugit.\n' +
            'Stillicidium bardus utrimque acsi spargo cur.\n' +
            'Aqua avaritia thesaurus volo combibo stultus utor.',
          description: 'Shows lorem.lines using lineCountMax.',
        },
        {
          functionCall: 'lorem.lines(lineCountMin=5)',
          sampleReturnValue:
            'A cognatus arca aliquam audentia coniuratio crux fugit.\n' +
            'Stillicidium bardus utrimque acsi spargo cur.\n' +
            'Aqua avaritia thesaurus volo combibo stultus utor.',
          description: 'Shows lorem.lines using lineCountMin.',
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
          name: 'lineCount',
          type: 'number',
          required: false,
          description: 'Exact number of lines to generate.',
        },
        {
          name: 'lineCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of lines to generate.',
        },
        {
          name: 'lineCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of lines to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.paragraph',
    delegate: {
      type: 'faker',
      target: 'lorem.paragraph',
    },
    help: {
      summary: 'Generates a paragraph with the given number of sentences.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
      fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
      validator: validateStringValue,
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
          sampleReturnValue: 'Suppellex a cognatus arca aliquam audentia.',
          description: 'Shows lorem.paragraph using min.',
        },
        {
          functionCall: 'lorem.paragraph(max=5)',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.',
          description: 'Shows lorem.paragraph using max.',
        },
        {
          functionCall: 'lorem.paragraph(sentenceCount=5)',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.',
          description: 'Shows lorem.paragraph using sentenceCount.',
        },
        {
          functionCall: 'lorem.paragraph(sentenceCountMax=5)',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.',
          description: 'Shows lorem.paragraph using sentenceCountMax.',
        },
        {
          functionCall: 'lorem.paragraph(sentenceCountMin=5)',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.',
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
  },
  {
    keyword: 'lorem.paragraphs',
    delegate: {
      type: 'faker',
      target: 'lorem.paragraphs',
    },
    help: {
      summary: 'Generates the given number of paragraphs.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
      fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'lorem.paragraphs()',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\n' +
            'Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\n' +
            'Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.',
          description: 'Shows lorem.paragraphs when optional params are omitted.',
        },
        {
          functionCall: 'lorem.paragraphs(max=10, min=1)',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.',
          description: 'Shows lorem.paragraphs using min.',
        },
        {
          functionCall: 'lorem.paragraphs(max=5)',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.5Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.5Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.',
          description: 'Shows lorem.paragraphs using max.',
        },
        {
          functionCall: 'lorem.paragraphs(paragraphCount=5)',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\n' +
            'Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\n' +
            'Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.',
          description: 'Shows lorem.paragraphs using paragraphCount.',
        },
        {
          functionCall: 'lorem.paragraphs(separator="-")',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\n' +
            'Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\n' +
            'Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.',
          description: 'Shows lorem.paragraphs using separator.',
        },
        {
          functionCall: 'lorem.paragraphs(paragraphCountMax=5)',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\n' +
            'Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\n' +
            'Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.',
          description: 'Shows lorem.paragraphs using paragraphCountMax.',
        },
        {
          functionCall: 'lorem.paragraphs(paragraphCountMin=5)',
          sampleReturnValue:
            'Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\n' +
            'Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\n' +
            'Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.',
          description: 'Shows lorem.paragraphs using paragraphCountMin.',
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
          name: 'paragraphCount',
          type: 'number',
          required: false,
          description: 'Number of paragraphs to generate.',
        },
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: 'Separator inserted between generated items.',
        },
        {
          name: 'paragraphCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of paragraphs to generate.',
        },
        {
          name: 'paragraphCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of paragraphs to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.sentence',
    delegate: {
      type: 'faker',
      target: 'lorem.sentence',
    },
    help: {
      summary: 'Generates a space separated list of words beginning with a capital letter and ending with a period.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
      fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'lorem.sentence()',
          sampleReturnValue: 'Suppellex a cognatus arca aliquam audentia.',
          description: 'Shows lorem.sentence when optional params are omitted.',
        },
        {
          functionCall: 'lorem.sentence(max=10, min=1)',
          sampleReturnValue: 'Cur.',
          description: 'Shows lorem.sentence using min.',
        },
        {
          functionCall: 'lorem.sentence(max=5)',
          sampleReturnValue: 'Suppellex a cognatus arca aliquam audentia.',
          description: 'Shows lorem.sentence using max.',
        },
        {
          functionCall: 'lorem.sentence(wordCount=5)',
          sampleReturnValue: 'Suppellex a cognatus arca aliquam audentia.',
          description: 'Shows lorem.sentence using wordCount.',
        },
        {
          functionCall: 'lorem.sentence(wordCountMax=5)',
          sampleReturnValue: 'Suppellex a cognatus arca aliquam audentia.',
          description: 'Shows lorem.sentence using wordCountMax.',
        },
        {
          functionCall: 'lorem.sentence(wordCountMin=5)',
          sampleReturnValue: 'Suppellex a cognatus arca aliquam audentia.',
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
  },
  {
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
  },
  {
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
  },
  {
    keyword: 'lorem.text',
    delegate: {
      type: 'faker',
      target: 'lorem.text',
    },
    help: {
      summary: 'Generates a random text based on a random lorem method.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
      fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'lorem.text',
          sampleReturnValue:
            'A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.',
          description: 'Shows the default lorem.text call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'lorem.word',
    delegate: {
      type: 'faker',
      target: 'lorem.word',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a word of a specified length.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/lorem',
      fakerDocsUrl: 'https://fakerjs.dev/api/lorem',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'lorem.word()',
          sampleReturnValue: 'cur',
          description: 'Shows lorem.word when optional params are omitted.',
        },
        {
          functionCall: 'lorem.word(max=10, min=1)',
          sampleReturnValue: 'cur',
          description: 'Shows lorem.word using min.',
        },
        {
          functionCall: 'lorem.word(max=5)',
          sampleReturnValue: 'cur',
          description: 'Shows lorem.word using max.',
        },
        {
          functionCall: 'lorem.word(length=5)',
          sampleReturnValue: 'curvo',
          description: 'Shows lorem.word using length.',
        },
        {
          functionCall: 'lorem.word(strategy="any-length")',
          sampleReturnValue: 'cur',
          description: 'Shows lorem.word using strategy.',
        },
      ],
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum word length when generating a ranged length.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum word length when generating a ranged length.',
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Exact word length to generate.',
        },
        {
          name: 'strategy',
          type: LOREM_WORD_STRATEGY_TYPE,
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
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
  },
];

export { DOMAIN_FAKER_LOREM_KEYWORD_DEFINITIONS };
