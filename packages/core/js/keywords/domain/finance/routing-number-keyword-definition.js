import { validateRoutingNumberValue } from '../../../command-help/command-help-validators.js';

const FINANCE_ROUTING_NUMBER_KEYWORD_DEFINITION = {
  keyword: 'finance.routingNumber',
  delegate: {
    type: 'faker',
    target: 'finance.routingNumber',
  },
  help: {
    summary: 'Generates a random routing number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/finance',
    fakerDocsUrl: 'https://fakerjs.dev/api/finance',
    validator: validateRoutingNumberValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'finance.routingNumber',
        sampleReturnValue: '470310139',
        description: 'Shows the default finance.routingNumber call.',
      },
    ],
    args: [],
  },
};

export { FINANCE_ROUTING_NUMBER_KEYWORD_DEFINITION };
