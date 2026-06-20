import { validateStringValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_AIRLINE_NAME_KEYWORD_DEFINITION = {
  keyword: 'airline.airline.name',
  delegate: {
    type: 'faker',
    target: 'airline.airline',
    resultPath: 'name',
  },
  help: {
    summary: 'Generate an airline name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.airline.name',
        sampleReturnValue: 'Flydubai',
        description: 'Shows the default airline.airline.name call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRLINE_NAME_KEYWORD_DEFINITION };
