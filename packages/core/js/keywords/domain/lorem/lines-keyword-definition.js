import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOREM_LINES_KEYWORD_DEFINITION = {
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
};

export { LOREM_LINES_KEYWORD_DEFINITION };
