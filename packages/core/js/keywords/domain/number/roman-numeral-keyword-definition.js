import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createOrderedArgsValidator } from '../../../domain/domain-keyword-arg-validators.js';

const validateRomanNumeralBounds = createOrderedArgsValidator({ lowerName: 'min', upperName: 'max' });

const NUMBER_ROMAN_NUMERAL_KEYWORD_DEFINITION = {
  keyword: 'number.romanNumeral',
  delegate: {
    type: 'faker',
    target: 'number.romanNumeral',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a roman numeral in String format.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
    fakerDocsUrl: 'https://fakerjs.dev/api/number',
    validator: validateStringValue,
    argsValidator: validateRomanNumeralBounds,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'number.romanNumeral()',
        sampleReturnValue: 'MDCLXVIII',
        description: 'Shows number.romanNumeral when optional params are omitted.',
      },
      {
        functionCall: 'number.romanNumeral(max=10, min=1)',
        sampleReturnValue: 'V',
        description: 'Shows number.romanNumeral using min.',
      },
      {
        functionCall: 'number.romanNumeral(max=5)',
        sampleReturnValue: 'III',
        description: 'Shows number.romanNumeral using max.',
      },
    ],
    args: [
      {
        name: 'min',
        type: 'number',
        required: false,
        description: 'Minimum bound used when generating a value.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'Maximum bound used when generating a value.',
      },
    ],
  },
};

export { NUMBER_ROMAN_NUMERAL_KEYWORD_DEFINITION };
