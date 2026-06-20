import { validateStringValue } from '../../../command-help/command-help-validators.js';

const VEHICLE_FUEL_KEYWORD_DEFINITION = {
  keyword: 'vehicle.fuel',
  delegate: {
    type: 'faker',
    target: 'vehicle.fuel',
  },
  help: {
    summary: 'Returns a fuel type.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
    fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'vehicle.fuel',
        sampleReturnValue: 'Electric',
        description: 'Shows the default vehicle.fuel call.',
      },
    ],
    args: [],
  },
};

export { VEHICLE_FUEL_KEYWORD_DEFINITION };
