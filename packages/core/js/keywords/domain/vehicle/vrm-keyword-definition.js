import { validateVrmValue } from '../../../command-help/command-help-validators.js';

const VEHICLE_VRM_KEYWORD_DEFINITION = {
  keyword: 'vehicle.vrm',
  delegate: {
    type: 'faker',
    target: 'vehicle.vrm',
  },
  help: {
    summary: 'Returns a vehicle registration number (Vehicle Registration Mark - VRM)',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/vehicle',
    fakerDocsUrl: 'https://fakerjs.dev/api/vehicle',
    validator: validateVrmValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'vehicle.vrm',
        sampleReturnValue: 'KS03DCE',
        description: 'Shows the default vehicle.vrm call.',
      },
    ],
    args: [],
  },
};

export { VEHICLE_VRM_KEYWORD_DEFINITION };
