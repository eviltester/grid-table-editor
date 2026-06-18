import { validateCounterStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_CUSTOM_STRING_KEYWORD_DEFINITIONS = [
  {
    keyword: 'string.counterString',
    delegate: {
      type: 'custom',
      target: 'string.counterString',
    },
    help: {
      summary:
        'Generates a counterstring for a random length between min and max (or fixed length when only one value is provided). Defaults to min=1 and max=25 when omitted.',
      docsUrl: '/docs/test-data/counterstrings',
      fakerDocsUrl: '',
      validator: validateCounterStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'string.counterString()',
          sampleReturnValue: '*3*5*7*10*13*',
          description: 'Shows string.counterString default from 1 to 25 chars.',
        },
        {
          functionCall: 'string.counterString(min=15)',
          sampleReturnValue: '*3*5*7*9*12*15*',
          description: 'Shows string.counterString with a fixed length of 15 chars.',
        },
        {
          functionCall: 'string.counterString(min=5, max=12)',
          sampleReturnValue: '*3*5*7*9*',
          description: 'Shows string.counterString with a length between 5 and 12 chars.',
        },
        {
          functionCall: 'string.counterString(min=12, max=12, delimiter="#")',
          sampleReturnValue: '#3#5#7#9#12#',
          description: 'Shows string.counterString with a fixed length of 12 chars and a custom delimiter.',
        },
        {
          functionCall: 'string.counterString(max=10, min=1)',
          sampleReturnValue: '2*4*6*',
          description: 'Shows string.counterString with a length between 1 and 10 chars.',
        },
        {
          functionCall: 'string.counterString(max=12)',
          sampleReturnValue: '*3*5*7*',
          description: 'Shows string.counterString with a length between 1 and 12 chars.',
        },
        {
          functionCall: 'string.counterString(delimiter="#")',
          sampleReturnValue: '#3#5#7#10#13#',
          description: 'Shows string.counterString using a custom delimiter and a length between 1 and 25 chars.',
        },
      ],
      args: [
        {
          name: 'min',
          type: 'integer',
          required: false,
          description:
            'Minimum counterstring length (integer). If max is omitted and min is provided, min is also used as max. Defaults to 1 when omitted. Non-integer values throw an exception.',
          examples: [5],
        },
        {
          name: 'max',
          type: 'integer',
          required: false,
          description:
            'Maximum counterstring length (integer). If less than min, values are swapped. Defaults to 25 when omitted. Non-integer values throw an exception.',
          examples: [12],
        },
        {
          name: 'delimiter',
          type: 'string',
          required: false,
          description: 'Delimiter character used between position markers. Defaults to "*".',
          examples: ['#'],
        },
      ],
    },
  },
];

export { DOMAIN_CUSTOM_STRING_KEYWORD_DEFINITIONS };
