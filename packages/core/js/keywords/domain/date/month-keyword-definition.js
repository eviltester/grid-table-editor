import { validateStringValue } from '../../../command-help/command-help-validators.js';

const DATE_MONTH_KEYWORD_DEFINITION = {
  keyword: 'date.month',
  delegate: {
    type: 'faker',
    target: 'date.month',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random name of a month.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'date.month()',
        sampleReturnValue: 'July',
        description: 'Shows date.month when optional params are omitted.',
      },
      {
        functionCall: 'date.month(abbreviated=true)',
        sampleReturnValue: 'Jul',
        description: 'Shows date.month using abbreviated.',
      },
      {
        functionCall: 'date.month(context=true)',
        sampleReturnValue: 'July',
        description: 'Shows date.month using context.',
      },
    ],
    args: [
      {
        name: 'abbreviated',
        type: 'boolean',
        required: false,
        description: 'Whether to return an abbreviation.',
      },
      {
        name: 'context',
        type: 'boolean',
        required: false,
        description:
          'Whether to return the name of a month in the context of a date. In the currently supported locale this has no visible effect. This option is mainly relevant for future multi-locale support (for example, locale-specific grammar/capitalization differences).',
      },
    ],
  },
};

export { DATE_MONTH_KEYWORD_DEFINITION };
