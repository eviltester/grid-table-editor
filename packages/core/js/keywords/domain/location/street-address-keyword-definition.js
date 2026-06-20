import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_STREET_ADDRESS_KEYWORD_DEFINITION = {
  keyword: 'location.streetAddress',
  delegate: {
    type: 'faker',
    target: 'location.streetAddress',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random localized street address.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.streetAddress()',
        sampleReturnValue: '7031 Iris Mill',
        description: 'Shows location.streetAddress when optional params are omitted.',
      },
      {
        functionCall: 'location.streetAddress(useFullAddress=true)',
        sampleReturnValue: '7031 Iris Mill Apt. 728',
        description: 'Shows location.streetAddress using useFullAddress.',
      },
    ],
    args: [
      {
        name: 'useFullAddress',
        type: 'boolean',
        required: false,
        description: 'Whether to expand to a full address including secondary address information.',
      },
    ],
  },
};

export { LOCATION_STREET_ADDRESS_KEYWORD_DEFINITION };
