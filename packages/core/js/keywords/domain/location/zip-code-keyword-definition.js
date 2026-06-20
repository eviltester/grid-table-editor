import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_ZIP_CODE_KEYWORD_DEFINITION = {
  keyword: 'location.zipCode',
  delegate: {
    type: 'faker',
    target: 'location.zipCode',
  },
  help: {
    summary: 'Generates data using faker location zip code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.zipCode',
        sampleReturnValue: '70310',
        description: 'Shows the default location.zipCode call.',
      },
    ],
    args: [],
  },
};

export { LOCATION_ZIP_CODE_KEYWORD_DEFINITION };
