import { validateCountryCodeValue } from '../../../command-help/command-help-validators.js';

const LOCATION_COUNTRY_CODE_KEYWORD_DEFINITION = {
  keyword: 'location.countryCode',
  delegate: {
    type: 'faker',
    target: 'location.countryCode',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random ISO_3166-1 country code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateCountryCodeValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'location.countryCode()',
        sampleReturnValue: 'IM',
        description: 'Shows location.countryCode when optional params are omitted.',
      },
      {
        functionCall: 'location.countryCode(variant="alpha-3")',
        sampleReturnValue: 'IMN',
        description: 'Shows location.countryCode using variant.',
      },
    ],
    args: [
      {
        name: 'variant',
        type: 'alpha-2|alpha-3|numeric',
        required: false,
        description:
          "The code to return. Can be either 'alpha-2' (two-letter code), 'alpha-3' (three-letter code) or 'numeric' (numeric code).",
        examples: ['alpha-3'],
      },
    ],
  },
};

export { LOCATION_COUNTRY_CODE_KEYWORD_DEFINITION };
