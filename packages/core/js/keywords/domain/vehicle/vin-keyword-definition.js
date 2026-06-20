import { validateVinValue } from '../../../command-help/command-help-validators.js';

const VEHICLE_VIN_KEYWORD_DEFINITION = {
  keyword: 'vehicle.vin',
  delegate: {
    type: 'faker',
    target: 'vehicle.vin',
  },
  help: {
    summary: 'Returns a vehicle identification number (VIN).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
    fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
    validator: validateVinValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'vehicle.vin',
        sampleReturnValue: 'DP09436BDHKN28064',
        description: 'Shows the default vehicle.vin call.',
      },
    ],
    args: [],
  },
};

export { VEHICLE_VIN_KEYWORD_DEFINITION };
