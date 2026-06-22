import { validateNumberValue } from '../../../command-help/command-help-validators.js';
import { createOrderedArgsValidator } from '../../../domain/domain-keyword-arg-validators.js';

const validateLongitudeBounds = createOrderedArgsValidator({ lowerName: 'min', upperName: 'max' });

const LOCATION_LONGITUDE_KEYWORD_DEFINITION = {
  keyword: 'location.longitude',
  delegate: {
    type: 'faker',
    target: 'location.longitude',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random longitude.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
    fakerDocsUrl: 'https://fakerjs.dev/api/location',
    validator: validateNumberValue,
    argsValidator: validateLongitudeBounds,
    returnType: 'number',
    usageExamples: [
      {
        functionCall: 'location.longitude()',
        sampleReturnValue: -29.8721,
        description: 'Shows location.longitude when optional params are omitted.',
      },
      {
        functionCall: 'location.longitude(max=10, min=1)',
        sampleReturnValue: 4.7532,
        description: 'Shows location.longitude using min.',
      },
      {
        functionCall: 'location.longitude(max=5)',
        sampleReturnValue: -102.8509,
        description: 'Shows location.longitude using max.',
      },
      {
        functionCall: 'location.longitude(precision=1)',
        sampleReturnValue: -29.9,
        description: 'Shows location.longitude using precision.',
      },
    ],
    args: [
      {
        name: 'min',
        type: 'number',
        required: false,
        description: 'The lower bound for the longitude to generate.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'The upper bound for the longitude to generate.',
      },
      {
        name: 'precision',
        type: 'number',
        required: false,
        description: 'The number of decimal points of precision for the longitude.',
      },
    ],
  },
};

export { LOCATION_LONGITUDE_KEYWORD_DEFINITION };
