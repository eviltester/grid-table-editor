import { validateStringValue } from '../../../command-help/command-help-validators.js';

const VEHICLE_VEHICLE_KEYWORD_DEFINITION = {
  keyword: 'vehicle.vehicle',
  delegate: {
    type: 'faker',
    target: 'vehicle.vehicle',
  },
  help: {
    summary: 'Returns a random vehicle.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
    fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'vehicle.vehicle',
        sampleReturnValue: 'Lamborghini Model X',
        description: 'Shows the default vehicle.vehicle call.',
      },
    ],
    args: [],
  },
};

export { VEHICLE_VEHICLE_KEYWORD_DEFINITION };
