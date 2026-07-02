import { validateAirlineRecordLocatorValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_RECORD_LOCATOR_KEYWORD_DEFINITION = {
  keyword: 'airline.recordLocator',
  delegate: {
    type: 'faker',
    target: 'airline.recordLocator',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random record locator. Record locators are 6-character alphanumeric booking references.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateAirlineRecordLocatorValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.recordLocator()',
        sampleReturnValue: 'KTAGDC',
        description: 'Shows the default airline.recordLocator call.',
      },
      {
        functionCall: 'airline.recordLocator(allowNumerics=true)',
        sampleReturnValue: 'ER2B64',
        description: 'Shows airline.recordLocator allowing numeric characters.',
      },
      {
        functionCall: 'airline.recordLocator(allowVisuallySimilarCharacters=true)',
        sampleReturnValue: 'KSAHDC',
        description: 'Shows airline.recordLocator allowing visually similar characters.',
      },
    ],
    args: [
      {
        name: 'allowNumerics',
        type: 'boolean',
        required: false,
        description: 'Whether numeric characters can be included.',
        examples: [true],
      },
      {
        name: 'allowVisuallySimilarCharacters',
        type: 'boolean',
        required: false,
        description: 'Whether visually similar characters such as I, 1, O, and 0 can be included.',
        examples: [true],
      },
    ],
  },
};

export { AIRLINE_RECORD_LOCATOR_KEYWORD_DEFINITION };
