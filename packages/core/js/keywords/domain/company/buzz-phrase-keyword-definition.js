import { validateStringValue } from '../../../command-help/command-help-validators.js';

const COMPANY_BUZZ_PHRASE_KEYWORD_DEFINITION = {
  keyword: 'company.buzzPhrase',
  delegate: {
    type: 'faker',
    target: 'company.buzzPhrase',
  },
  help: {
    summary: 'Generates a random buzz phrase that can be used to demonstrate data being viewed by a manager.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/company',
    fakerDocsUrl: 'https://fakerjs.dev/api/company',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'company.buzzPhrase',
        sampleReturnValue: 'grow robust AI',
        description: 'Shows the default company.buzzPhrase call.',
      },
    ],
    args: [],
  },
};

export { COMPANY_BUZZ_PHRASE_KEYWORD_DEFINITION };
