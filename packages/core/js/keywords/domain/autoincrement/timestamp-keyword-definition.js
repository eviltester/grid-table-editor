import { validateStringValue } from '../../../command-help/command-help-validators.js';

const AUTO_INCREMENT_TIMESTAMP_KEYWORD_DEFINITION = {
  keyword: 'autoIncrement.timestamp',
  delegate: {
    type: 'custom',
    target: 'autoIncrement.timestamp',
  },
  help: {
    summary:
      'Generates a timestamp that starts from a fixed point and increments by the configured amount for each generated row.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/autoIncrement',
    fakerDocsUrl: '',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds")',
        sampleReturnValue: '2026-06-12T12:39:23Z',
        description: 'Shows autoIncrement.timestamp in use.',
      },
      {
        functionCall: 'autoIncrement.timestamp()',
        sampleReturnValue: '2026-06-18T15:55:20Z',
        description: 'Shows autoIncrement.timestamp in use.',
      },
      {
        functionCall: 'autoIncrement.timestamp(start="20/03/1969", step=1, type="days")',
        sampleReturnValue: '1969-03-20T12:00:00Z',
        description: 'Shows autoIncrement.timestamp in use.',
      },
      {
        functionCall:
          'autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=15, type="minutes", outputFormat="yyyy-MM-dd HH:mm:ss")',
        sampleReturnValue: '2026-06-12 12:39:23',
        description: 'Shows autoIncrement.timestamp using a custom output format.',
      },
      {
        functionCall: 'autoIncrement.timestamp(start="20/03/1969", inputFormat="dd/MM/yyyy", step=1, type="days")',
        sampleReturnValue: '1969-03-20T00:00:00Z',
        description: 'Shows autoIncrement.timestamp in use.',
      },
      {
        functionCall: 'autoIncrement.timestamp(start="2026-06-12T12:39:23Z")',
        sampleReturnValue: '2026-06-12T12:39:23Z',
        description: 'Shows autoIncrement.timestamp using start.',
      },
      {
        functionCall: 'autoIncrement.timestamp(step=1)',
        sampleReturnValue: '2026-06-18T15:55:20Z',
        description: 'Shows autoIncrement.timestamp using step.',
      },
      {
        functionCall: 'autoIncrement.timestamp(type="seconds")',
        sampleReturnValue: '2026-06-18T15:55:20Z',
        description: 'Shows autoIncrement.timestamp using type.',
      },
      {
        functionCall: 'autoIncrement.timestamp(outputFormat="iso8601")',
        sampleReturnValue: '2026-06-18T15:55:20Z',
        description: 'Shows autoIncrement.timestamp using outputFormat.',
      },
      {
        functionCall: 'autoIncrement.timestamp(start="20/03/1969", inputFormat="dd/MM/yyyy")',
        sampleReturnValue: '1969-03-20T00:00:00Z',
        description: 'Shows autoIncrement.timestamp using inputFormat.',
      },
    ],
    args: [
      {
        name: 'start',
        type: 'string|number',
        required: false,
        description:
          'Starting timestamp. Defaults to the generation run start time. Valid examples include "2026-06-12T12:39:23Z", "20/03/1969", "12-06-2026 12:39:23", or a Unix timestamp like 1718195963000.',
        examples: ['2026-06-12T12:39:23Z', '20/03/1969', 1718195963000],
      },
      {
        name: 'step',
        type: 'number',
        required: false,
        description: 'Amount added for each generated row. Defaults to 1.',
        examples: [1, 15],
      },
      {
        name: 'type',
        type: 'string',
        required: false,
        description:
          'Unit applied to step for each row. Supports milliseconds, seconds, minutes, hours, days, weeks, months, or years. Defaults to seconds.',
        examples: ['seconds', 'days'],
      },
      {
        name: 'outputFormat',
        type: 'string',
        required: false,
        description:
          'Output format. Defaults to ISO-8601 without milliseconds. Use "iso8601" for the default behaviour or a custom pattern such as "yyyy-MM-dd HH:mm:ss".',
        examples: ['iso8601', "yyyy-MM-dd'T'HH:mm:ssXXX"],
      },
      {
        name: 'inputFormat',
        type: 'string',
        required: false,
        description:
          'Optional parse pattern used only for the start argument when you want to match a specific text shape such as "dd/MM/yyyy" or "dd-MM-yyyy HH:mm:ss".',
        examples: ['dd/MM/yyyy', 'yyyy-MM-dd HH:mm:ss'],
      },
    ],
  },
};

export { AUTO_INCREMENT_TIMESTAMP_KEYWORD_DEFINITION };
