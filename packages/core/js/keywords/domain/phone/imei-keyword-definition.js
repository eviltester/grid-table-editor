import { validateImeiValue } from '../../../command-help/command-help-validators.js';

const PHONE_IMEI_KEYWORD_DEFINITION = {
  keyword: 'phone.imei',
  delegate: {
    type: 'faker',
    target: 'phone.imei',
  },
  help: {
    summary: 'Generates IMEI number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/phone',
    fakerDocsUrl: 'https://fakerjs.dev/api/phone',
    validator: validateImeiValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'phone.imei',
        sampleReturnValue: '47-031013-354628-7',
        description: 'Shows the default phone.imei call.',
      },
    ],
    args: [],
  },
};

export { PHONE_IMEI_KEYWORD_DEFINITION };
