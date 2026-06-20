import { validateCronValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_CRON_KEYWORD_DEFINITION = {
  keyword: 'system.cron',
  delegate: {
    type: 'faker',
    target: 'system.cron',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random cron expression.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateCronValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.cron()',
        sampleReturnValue: '25 17 * 4 *',
        description: 'Shows system.cron when optional params are omitted.',
      },
      {
        functionCall: 'system.cron(includeNonStandard=true)',
        sampleReturnValue: '@annually',
        description: 'Shows system.cron using includeNonStandard.',
      },
      {
        functionCall: 'system.cron(includeYear=true)',
        sampleReturnValue: '25 17 * 4 * 1994',
        description: 'Shows system.cron using includeYear.',
      },
    ],
    args: [
      {
        name: 'includeNonStandard',
        type: 'boolean',
        required: false,
        description: 'Whether to include a @yearly, @monthly, @daily, etc text labels in the generated expression.',
      },
      {
        name: 'includeYear',
        type: 'boolean',
        required: false,
        description: 'Whether to include a year in the generated expression.',
      },
    ],
  },
};

export { SYSTEM_CRON_KEYWORD_DEFINITION };
