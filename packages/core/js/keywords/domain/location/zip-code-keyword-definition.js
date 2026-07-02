import { validateStringValue } from '../../../command-help/command-help-validators.js';

const LOCATION_ZIP_CODE_KEYWORD_DEFINITION = {
  keyword: 'location.zipCode',
  delegate: {
    type: 'faker',
    target: 'location.zipCode',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates data using faker location zip code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.zipCode()',
        sampleReturnValue: '70310',
        description: 'Shows the default location.zipCode call.',
      },
      {
        functionCall: 'location.zipCode(format="#####")',
        sampleReturnValue: '47031',
        description: 'Shows location.zipCode using a format option.',
      },
    ],
    args: [
      {
        name: 'state',
        type: 'string',
        required: false,
        usageExampleSupported: false,
        description: 'State abbreviation used to constrain the generated zip code where supported by the locale.',
        examples: ['CA'],
      },
      {
        name: 'format',
        type: 'string',
        required: false,
        description: 'Format pattern used for the generated zip code.',
        examples: ['#####'],
      },
    ],
  },
};

export { LOCATION_ZIP_CODE_KEYWORD_DEFINITION };
