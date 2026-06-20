import { validateStringValue } from '../../../command-help/command-help-validators.js';

const VEHICLE_MODEL_KEYWORD_DEFINITION = {
  keyword: 'vehicle.model',
  delegate: {
    type: 'faker',
    target: 'vehicle.model',
  },
  help: {
    summary: 'Returns a vehicle model.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
    fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'vehicle.model',
        sampleReturnValue: 'Escalade',
        description: 'Shows the default vehicle.model call.',
      },
    ],
    args: [],
  },
};

export { VEHICLE_MODEL_KEYWORD_DEFINITION };
