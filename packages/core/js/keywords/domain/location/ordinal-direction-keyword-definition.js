import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_ORDINAL_DIRECTION_KEYWORD_DEFINITION = {
  keyword: 'location.ordinalDirection',
  delegate: {
    type: 'faker',
    target: 'location.ordinalDirection',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random ordinal direction (northwest, southeast, etc).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.ordinalDirection()',
        sampleReturnValue: 'Northwest',
        description: 'Shows location.ordinalDirection when optional params are omitted.',
      },
      {
        functionCall: 'location.ordinalDirection(abbreviated=true)',
        sampleReturnValue: 'NW',
        description: 'Shows location.ordinalDirection using abbreviated.',
      },
    ],
    args: [
      {
        name: 'abbreviated',
        type: 'boolean',
        required: false,
        description:
          'If true this will return abbreviated ordinal directions (NW, SE, etc). Otherwise this will return the long name.',
      },
    ],
  },
};

export { LOCATION_ORDINAL_DIRECTION_KEYWORD_DEFINITION };
