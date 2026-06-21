import { validateArrayValue } from '../../../command-help/command-help-validators.js';

const LOCATION_NEARBY_GPSCOORDINATE_KEYWORD_DEFINITION = {
  keyword: 'location.nearbyGPSCoordinate',
  delegate: {
    type: 'faker',
    target: 'location.nearbyGPSCoordinate',
  },
  help: {
    summary: 'Generates a random GPS coordinate within the specified radius from the given coordinate.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateArrayValue,
    returnType: 'array',
    usageExamples: [
      {
        functionCall: 'location.nearbyGPSCoordinate',
        sampleReturnValue: [-14.936, 79.3168],
        description: 'Shows the default location.nearbyGPSCoordinate call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_NEARBY_GPSCOORDINATE_KEYWORD_DEFINITION };
