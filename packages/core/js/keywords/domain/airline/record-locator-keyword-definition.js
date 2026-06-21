import { validateAirlineRecordLocatorValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_RECORD_LOCATOR_KEYWORD_DEFINITION = {
  keyword: 'airline.recordLocator',
  delegate: {
    type: 'faker',
    target: 'airline.recordLocator',
  },
  help: {
    summary: 'Generates a random record locator. Record locators are 6-character alphanumeric booking references.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateAirlineRecordLocatorValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.recordLocator',
        sampleReturnValue: 'KTAGDC',
        description: 'Shows the default airline.recordLocator call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_RECORD_LOCATOR_KEYWORD_DEFINITION };
