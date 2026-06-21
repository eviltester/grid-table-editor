import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_STATE_KEYWORD_DEFINITION = {
  keyword: 'location.state',
  delegate: {
    type: 'faker',
    target: 'location.state',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary:
      "Returns a random localized state, or other equivalent first-level administrative entity for the locale's country such as a province or region.",
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.state()',
        sampleReturnValue: 'Massachusetts',
        description: 'Shows location.state when optional params are omitted.',
      },
      {
        functionCall: 'location.state(abbreviated=true)',
        sampleReturnValue: 'MA',
        description: 'Shows location.state using abbreviated.',
      },
    ],
    args: [
      {
        name: 'abbreviated',
        type: 'boolean',
        required: false,
        description:
          'If true this will return abbreviated first-level administrative entity names. Otherwise this will return the long name.',
      },
    ],
  },
};

export { LOCATION_STATE_KEYWORD_DEFINITION };
