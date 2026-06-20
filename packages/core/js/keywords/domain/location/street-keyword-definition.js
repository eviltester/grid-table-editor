import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_STREET_KEYWORD_DEFINITION = {
  keyword: 'location.street',
  delegate: {
    type: 'faker',
    target: 'location.street',
  },
  help: {
    summary: 'Generates a random localized street name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.street',
        sampleReturnValue: 'Gutmann Creek',
        description: 'Shows the default location.street call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_STREET_KEYWORD_DEFINITION };
