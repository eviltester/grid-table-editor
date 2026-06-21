import { validateStringValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_AIRPLANE_NAME_KEYWORD_DEFINITION = {
  keyword: 'airline.airplane.name',
  delegate: {
    type: 'faker',
    target: 'airline.airplane',
    resultPath: 'name',
  },
  help: {
    summary: 'Generate an airplane model name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.airplane.name',
        sampleReturnValue: 'Boeing 747-400D',
        description: 'Shows the default airline.airplane.name call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRPLANE_NAME_KEYWORD_DEFINITION };
