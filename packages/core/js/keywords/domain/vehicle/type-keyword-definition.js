import { validateStringValue } from '../../../command-help/command-help-validators.js';

const VEHICLE_TYPE_KEYWORD_DEFINITION = {
  keyword: 'vehicle.type',
  delegate: {
    type: 'faker',
    target: 'vehicle.type',
  },
  help: {
    summary: 'Returns a vehicle type.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
    fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'vehicle.type',
        sampleReturnValue: 'Extended Cab Pickup',
        description: 'Shows the default vehicle.type call.',
      },
    ],
    args: [],
  },
};

export { VEHICLE_TYPE_KEYWORD_DEFINITION };
