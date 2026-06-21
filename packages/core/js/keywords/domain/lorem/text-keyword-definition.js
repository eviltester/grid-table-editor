import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOREM_TEXT_KEYWORD_DEFINITION = {
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
};

export { LOREM_TEXT_KEYWORD_DEFINITION };
