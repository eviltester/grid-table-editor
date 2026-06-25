import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_CARDINAL_DIRECTION_KEYWORD_DEFINITION = {
  keyword: 'location.cardinalDirection',
  delegate: {
    type: 'faker',
    target: 'location.cardinalDirection',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random cardinal direction (north, east, south, west).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.cardinalDirection()',
        sampleReturnValue: 'East',
        description: 'Shows location.cardinalDirection when optional params are omitted.',
      },
      {
        functionCall: 'location.cardinalDirection(abbreviated=true)',
        sampleReturnValue: 'E',
        description: 'Shows location.cardinalDirection using abbreviated.',
      },
    ],
    args: [
      {
        name: 'abbreviated',
        type: 'boolean',
        required: false,
        description:
          'If true this will return abbreviated cardinal directions (N, E, S, W). Otherwise this will return the long name.',
      },
    ],
  },
};

export { LOCATION_CARDINAL_DIRECTION_KEYWORD_DEFINITION };
