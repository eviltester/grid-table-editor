import { validateLiteralValue } from '../command-help/command-help-validators.js';

const DOMAIN_CUSTOM_LITERAL_KEYWORD_DEFINITIONS = [
  {
    keyword: 'literal.value',
    delegate: {
      type: 'custom',
      target: 'literal.value',
    },
    help: {
      summary: 'Return the literal value provided by the caller.',
      docsUrl: 'https://anywaydata.com/docs/category/generating-data',
      fakerDocsUrl: '',
      validator: validateLiteralValue,
      returnType: 'string|number|boolean',
      usageExamples: [
        {
          functionCall: 'literal.value(value="Pending")',
          sampleReturnValue: 'Pending',
          description: 'Shows literal.value in use.',
        },
        {
          functionCall: 'literal.value(value="")',
          sampleReturnValue: '',
          description: 'Shows literal.value in use.',
        },
        {
          functionCall: 'literal.value()',
          sampleReturnValue: '',
          description: 'Shows literal.value when optional params are omitted.',
        },
        {
          functionCall: 'literal.value(value=1)',
          sampleReturnValue: 1,
          description: 'Shows literal.value using value.',
        },
      ],
      args: [
        {
          name: 'value',
          type: 'string|number|boolean',
          required: false,
          description: 'Literal value to return. When omitted, defaults to an empty string.',
        },
      ],
    },
  },
];

export { DOMAIN_CUSTOM_LITERAL_KEYWORD_DEFINITIONS };
