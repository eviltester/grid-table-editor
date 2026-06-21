import { validateStringValue } from '../../../command-help/command-help-validators.js';

const VEHICLE_MANUFACTURER_KEYWORD_DEFINITION = {
  keyword: 'vehicle.manufacturer',
  delegate: {
    type: 'faker',
    target: 'vehicle.manufacturer',
  },
  help: {
    summary: 'Returns a manufacturer name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
    fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'vehicle.manufacturer',
        sampleReturnValue: 'Lamborghini',
        description: 'Shows the default vehicle.manufacturer call.',
      },
    ],
    args: [],
  },
};

export { VEHICLE_MANUFACTURER_KEYWORD_DEFINITION };
