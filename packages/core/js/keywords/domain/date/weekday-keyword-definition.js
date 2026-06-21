import { validateStringValue } from '../../../command-help/command-help-validators.js';

const DATE_WEEKDAY_KEYWORD_DEFINITION = {
  keyword: 'date.weekday',
  delegate: {
    type: 'faker',
    target: 'date.weekday',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random day of the week.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'date.weekday()',
        sampleReturnValue: 'Saturday',
        description: 'Shows date.weekday when optional params are omitted.',
      },
      {
        functionCall: 'date.weekday(abbreviated=true)',
        sampleReturnValue: 'Sat',
        description: 'Shows date.weekday using abbreviated.',
      },
      {
        functionCall: 'date.weekday(context=true)',
        sampleReturnValue: 'Saturday',
        description: 'Shows date.weekday using context.',
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
          'Whether to return the day of the week in the context of a date. In the currently supported locale this has no visible effect. This option is mainly relevant for future multi-locale support (for example, locale-specific grammar/capitalization differences).',
      },
    ],
  },
};

export { DATE_WEEKDAY_KEYWORD_DEFINITION };
