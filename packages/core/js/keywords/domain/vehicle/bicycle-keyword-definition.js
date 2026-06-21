import { validateStringValue } from '../../../command-help/command-help-validators.js';

const VEHICLE_BICYCLE_KEYWORD_DEFINITION = {
  keyword: 'vehicle.bicycle',
  delegate: {
    type: 'faker',
    target: 'vehicle.bicycle',
  },
  help: {
    summary: 'Returns a type of bicycle.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
    fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'vehicle.bicycle',
        sampleReturnValue: 'Flat-Foot Comfort Bicycle',
        description: 'Shows the default vehicle.bicycle call.',
      },
    ],
    args: [],
  },
};

export { VEHICLE_BICYCLE_KEYWORD_DEFINITION };
