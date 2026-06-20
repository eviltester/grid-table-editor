import { validateStringValue } from '../../../command-help/command-help-validators.js';

const INTERNET_DISPLAY_NAME_KEYWORD_DEFINITION = {
  keyword: 'internet.displayName',
  delegate: {
    type: 'faker',
    target: 'internet.displayName',
  },
  help: {
    summary: "Generates a display name using the given person's name as base.",
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'internet.displayName',
        sampleReturnValue: 'Aaliyah.Bosco',
        description: 'Shows the default internet.displayName call.',
      },
    ],
    args: [],
  },
};

export { INTERNET_DISPLAY_NAME_KEYWORD_DEFINITION };
