import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_BUILDING_NUMBER_KEYWORD_DEFINITION = {
  keyword: 'location.buildingNumber',
  delegate: {
    type: 'faker',
    target: 'location.buildingNumber',
  },
  help: {
    summary: 'Generates a random building number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.buildingNumber',
        sampleReturnValue: '7031',
        description: 'Shows the default location.buildingNumber call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_BUILDING_NUMBER_KEYWORD_DEFINITION };
