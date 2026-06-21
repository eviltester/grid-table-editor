import { validateStringValue } from '../../../command-help/command-help-validators.js';

const VEHICLE_COLOR_KEYWORD_DEFINITION = {
  keyword: 'vehicle.color',
  delegate: {
    type: 'faker',
    target: 'vehicle.color',
  },
  help: {
    summary: 'Returns a vehicle color.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
    fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'vehicle.color',
        sampleReturnValue: 'magenta',
        description: 'Shows the default vehicle.color call.',
      },
    ],
    args: [],
  },
};

export { VEHICLE_COLOR_KEYWORD_DEFINITION };
