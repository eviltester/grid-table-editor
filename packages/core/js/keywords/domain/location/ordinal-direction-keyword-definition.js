import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_ORDINAL_DIRECTION_KEYWORD_DEFINITION = {
  keyword: 'location.ordinalDirection',
  delegate: {
    type: 'faker',
    target: 'location.ordinalDirection',
  },
  help: {
    summary: 'Returns a random ordinal direction (northwest, southeast, etc).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.ordinalDirection',
        sampleReturnValue: 'Northwest',
        description: 'Shows the default location.ordinalDirection call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_ORDINAL_DIRECTION_KEYWORD_DEFINITION };
