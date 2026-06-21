import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_SECONDARY_ADDRESS_KEYWORD_DEFINITION = {
  keyword: 'location.secondaryAddress',
  delegate: {
    type: 'faker',
    target: 'location.secondaryAddress',
  },
  help: {
    summary: 'Generates a random localized secondary address. This refers to a specific location at a given address',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.secondaryAddress',
        sampleReturnValue: 'Apt. 703',
        description: 'Shows the default location.secondaryAddress call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_SECONDARY_ADDRESS_KEYWORD_DEFINITION };
