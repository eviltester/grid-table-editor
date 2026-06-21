import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_DIRECTION_KEYWORD_DEFINITION = {
  keyword: 'location.direction',
  delegate: {
    type: 'faker',
    target: 'location.direction',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random direction (cardinal and ordinal; northwest, east, etc).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.direction()',
        sampleReturnValue: 'West',
        description: 'Shows location.direction when optional params are omitted.',
      },
      {
        functionCall: 'location.direction(abbreviated=true)',
        sampleReturnValue: 'W',
        description: 'Shows location.direction using abbreviated.',
      },
    ],
    args: [
      {
        name: 'abbreviated',
        type: 'boolean',
        required: false,
        description:
          'If true this will return abbreviated directions (NW, E, etc). Otherwise this will return the long name.',
      },
    ],
  },
};

export { LOCATION_DIRECTION_KEYWORD_DEFINITION };
