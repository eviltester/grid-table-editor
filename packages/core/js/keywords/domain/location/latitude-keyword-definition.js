import { validateNumberValue } from '../../../command-help/command-help-validators.js';
import { createOrderedArgsValidator } from '../../../domain/domain-keyword-arg-validators.js';

const validateLatitudeBounds = createOrderedArgsValidator({ lowerName: 'min', upperName: 'max' });

const LOCATION_LATITUDE_KEYWORD_DEFINITION = {
  keyword: 'location.latitude',
  delegate: {
    type: 'faker',
    target: 'location.latitude',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random latitude.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateNumberValue,
    argsValidator: validateLatitudeBounds,
    returnType: 'number',
    usageExamples: [
      {
        functionCall: 'location.latitude()',
        sampleReturnValue: -14.936,
        description: 'Shows location.latitude when optional params are omitted.',
      },
      {
        functionCall: 'location.latitude(max=10, min=1)',
        sampleReturnValue: 4.7532,
        description: 'Shows location.latitude using min.',
      },
      {
        functionCall: 'location.latitude(max=5)',
        sampleReturnValue: -50.3829,
        description: 'Shows location.latitude using max.',
      },
      {
        functionCall: 'location.latitude(precision=1)',
        sampleReturnValue: -14.9,
        description: 'Shows location.latitude using precision.',
      },
    ],
    args: [
      {
        name: 'min',
        type: 'number',
        required: false,
        description: 'The lower bound for the latitude to generate.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'The upper bound for the latitude to generate.',
      },
      {
        name: 'precision',
        type: 'number',
        required: false,
        description: 'The number of decimal points of precision for the latitude.',
      },
    ],
  },
};

export { LOCATION_LATITUDE_KEYWORD_DEFINITION };
