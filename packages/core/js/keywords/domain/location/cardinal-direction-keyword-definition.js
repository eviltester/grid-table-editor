import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_CARDINAL_DIRECTION_KEYWORD_DEFINITION = {
  keyword: 'location.cardinalDirection',
  delegate: {
    type: 'faker',
    target: 'location.cardinalDirection',
  },
  help: {
    summary: 'Returns a random cardinal direction (north, east, south, west).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.cardinalDirection',
        sampleReturnValue: 'East',
        description: 'Shows the default location.cardinalDirection call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_CARDINAL_DIRECTION_KEYWORD_DEFINITION };
